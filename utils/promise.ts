import bot from "ROOT";
import { getCharaDetail } from "#mari-plugin/utils/api";
import { enKaClass } from "#mari-plugin/init";
import { EnKa } from "#mari-plugin/utils/enka";
import { SendFunc } from "@modules/message";
import * as ApiType from "#mari-plugin/types"
import { typeData } from "#genshin/init";

export async function charaDetailPromise( uid: number, userID: number, charId: number, charName: string, sendMessage: SendFunc ): Promise<void> {
	const dbKey: string = `mari-plugin.chara-detail-list-${ uid }`;
	const detailStr: string = await bot.redis.getString( dbKey );
	
	let detail: ApiType.Detail;
	
	/* 数据库中无数据，前去请求数据 */
	if ( !detailStr ) {
		await sendMessage( "初次使用，正在获取数据，请稍后……" );
		const data = await getCharaDetail( uid );
		
		const { meta, chara, artifact } = enKaClass;
		detail = new EnKa( meta, chara, artifact ).getDetailInfo( data );
		
		await bot.redis.setString( dbKey, JSON.stringify( detail ) );
	} else {
		detail = JSON.parse( detailStr );
	}
	
	/* 获取所选角色的信息 */
	const currentChara = detail.avatars.find( a => {
		return charId === -1 ? a.id === 10000005 || a.id === 10000007 : a.id === charId;
	} );
	if ( !currentChara ) {
		throw `请确认「${ charName }」已被展示在游戏的角色展柜中，且打开了「显示角色详情」。`;
	}
	
	/* 获取所选角色属性 */
	const element = typeData.character[charName] === "!any!" ? "none" : typeData.character[charName];
	
	await bot.redis.setString( `mari-plugin.chara-detail-${ userID }`, JSON.stringify( {
		uid,
		username: detail.nickname,
		element,
		name: charName,
		...currentChara
	} ) );
}