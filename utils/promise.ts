import bot from "ROOT";
import { getCharaDetail } from "#mari-plugin/utils/api";
import { enKaClass } from "#mari-plugin/init";
import { EnKa } from "#mari-plugin/utils/enka";
import { SendFunc } from "@modules/message";
import * as ApiType from "#mari-plugin/types"

export enum ErrorMsg {
	ERROR_SERVER = "暂不支持b服用户查询",
	IS_PENDING = "两次请求间隔较短，请于 $ 后重试",
	PRIVATE_ACCOUNT = "请在游戏中打开「显示角色详情」后再次尝试。",
	NOT_FOUND = "请确认「$」已被展示在游戏的角色展柜中。",
	FORM_MESSAGE = "EnKa接口报错: "
}

function getLimitTime( differ: number ): string {
	differ = differ / 1000;
	const min = Math.floor( differ / 60 );
	const sec = ( differ % 60 ).toString().padStart( 2, "0" );
	return `${ min }分${ sec }秒`;
}

export async function charaDetailPromise( uid: number, userID: number, sendMessage: SendFunc, isUpdate: boolean ): Promise<ApiType.Detail> {
	if ( uid.toString()[0] === "5" ) {
		throw ErrorMsg.ERROR_SERVER;
	}
	
	const dbKey: string = `mari-plugin.chara-detail-list-${ uid }`;
	const detailStr: string = await bot.redis.getString( dbKey );
	
	let detail: ApiType.Detail = {
		nickname: "",
		avatars: [],
		updateTime: 0
	};
	
	/* 检查是否频繁请求 */
	if ( detailStr ) {
		detail = JSON.parse( detailStr );
		const differ = new Date().getTime() - detail.updateTime;
		if ( differ <= 300 * 1000 ) {
			const limit = getLimitTime( differ );
			throw ErrorMsg.IS_PENDING.replace( "$", limit );
		}
	}
	
	if ( !detailStr || isUpdate ) {
		if ( !isUpdate ) {
			await sendMessage( "初次使用，正在获取数据，请稍后……" );
		}
		let data: ApiType.EnKa;
		
		detail = JSON.parse( detailStr );
		try {
			data = await getCharaDetail( uid );
		} catch ( error ) {
			throw ErrorMsg.FORM_MESSAGE + error;
		}
		
		if ( !data.avatarInfoList ) {
			throw ErrorMsg.PRIVATE_ACCOUNT
		}
		const { meta, chara, artifact } = enKaClass;
		detail = new EnKa( meta, chara, artifact ).getDetailInfo( data );
		
		if ( !isUpdate ) {
			await bot.redis.setString( dbKey, JSON.stringify( detail ) );
		}
	}
	return detail
}