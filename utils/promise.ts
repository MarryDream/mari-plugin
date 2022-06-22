import bot from "ROOT";
import { getCharaDetail } from "#mari-plugin/utils/api";
import { enKaClass } from "#mari-plugin/init";
import { EnKa } from "#mari-plugin/utils/enka";
import { SendFunc } from "@modules/message";
import * as ApiType from "#mari-plugin/types"

export enum ErrorMsg {
	ERROR_SERVER = "暂不支持b服用户查询",
	IS_PENDING = "两次请求间隔较短，请于 $ 后再次尝试",
	PRIVATE_ACCOUNT = "请在游戏中打开「显示角色详情」后再次尝试。",
	NOT_FOUND = "请确认「$」已被展示在游戏的角色展柜中。",
	FORM_MESSAGE = "EnKa接口报错: "
}

function getLimitTime( differ: number ): string {
	differ = Math.floor( differ / 1000 );
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
	
	const limitWait: number = 5 * 60 * 1000;
	
	let detail: ApiType.Detail | null = detailStr ? JSON.parse( detailStr ) : null;
	
	/* 检查是否频繁请求 */
	if ( detail && isUpdate ) {
		const differ = new Date().getTime() - detail.updateTime;
		if ( differ <= limitWait ) {
			const limit = getLimitTime( limitWait - differ );
			throw ErrorMsg.IS_PENDING.replace( "$", limit );
		}
	}
	
	if ( !detail || isUpdate ) {
		const startMsg = isUpdate ? "开始更新面板数据，请稍后……" : "初次使用，正在获取数据，请稍后……";
		await sendMessage( startMsg );
		
		let data: ApiType.EnKa;
		try {
			data = await getCharaDetail( uid );
		} catch ( error ) {
			throw ErrorMsg.FORM_MESSAGE + error;
		}
		
		if ( !data.avatarInfoList ) {
			throw ErrorMsg.PRIVATE_ACCOUNT
		}
		
		let oldAvatars: ApiType.Avatar[] = detail ? detail.avatars : [];
		
		const { meta, chara, artifact } = enKaClass;
		detail = new EnKa( meta, chara, artifact ).getDetailInfo( data );
		
		if ( isUpdate ) {
			/* 组装新旧头像 */
			oldAvatars = oldAvatars.filter( oa => detail!.avatars.findIndex( na => oa.id === na.id ) === -1 );
			console.log(oldAvatars)
			detail.avatars = detail.avatars.concat( oldAvatars );
		}
		await bot.redis.setString( dbKey, JSON.stringify( detail ) );
	}
	return detail
}