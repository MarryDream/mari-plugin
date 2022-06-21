import { BOT } from "@modules/bot";
import { InputParameter } from "@modules/command";
import { getRealName, NameResult } from "#genshin/utils/name";
import { characterId } from "#mari-plugin/init";
import { renderer } from "#mari-plugin/init";
import { charaDetailPromise, ErrorMsg } from "#mari-plugin/utils/promise";
import { RenderResult } from "@modules/renderer";
import * as ApiType from "#mari-plugin/types";
import { typeData } from "#genshin/init";

async function getUID( userID: number, redis: BOT["redis"] ): Promise<number | string> {
	const uid: string = await redis.getString( `silvery-star.user-bind-uid-${ userID }` );
	return uid.length ? parseInt( uid ) : "您还未绑定游戏UID";
}

export async function main( { sendMessage, messageData, redis, logger }: InputParameter ): Promise<void> {
	const name: string = messageData.raw_message;
	const userID: number = messageData.user_id;
	
	/* 检查是否绑定了uid */
	const info = await getUID( userID, redis );
	if ( typeof info === "string" ) {
		await sendMessage( info );
		return;
	}
	
	/* 获取查询的角色id */
	const result: NameResult = getRealName( name );
	if ( !result.definite ) {
		const message: string = result.info.length === 0
			? "查询失败，请检查角色名称是否正确"
			: `未找到相关信息，是否要找：${ [ "", ...<string[]>result.info ].join( "\n  - " ) }`;
		await sendMessage( message );
		return;
	}
	const realName: string = <string>result.info;
	
	const charID: number = characterId.map[realName];
	
	/* 因无法获取属性，排除旅行者 */
	if ( charID === -1 ) {
		await sendMessage( `暂不支持查看「${ realName }」的面板详细信息` );
		return;
	}
	
	const uid: number = info;
	
	let detail: ApiType.Detail;
	
	try {
		detail = await charaDetailPromise( uid, userID, sendMessage, false );
	} catch ( error ) {
		if ( typeof error === "string" ) {
			await sendMessage( <string>error );
		} else {
			logger.error( error );
		}
		return;
	}
	
	/* 获取所选角色的信息 */
	const currentChara = detail.avatars.find( a => {
		return charID === -1 ? a.id === 10000005 || a.id === 10000007 : a.id === charID;
	} );
	
	if ( !currentChara ) {
		await sendMessage( ErrorMsg.NOT_FOUND.replace( "$", realName ) );
		return;
	}
	
	/* 获取所选角色属性 */
	const element = typeData.character[realName] === "!any!" ? "none" : typeData.character[realName];
	
	await redis.setString( `mari-plugin.chara-detail-${ userID }`, JSON.stringify( {
		uid,
		username: detail.nickname,
		element,
		...currentChara
	} ) );
	
	const res: RenderResult = await renderer.asCqCode(
		"/chara-detail.html", { qq: userID } );
	if ( res.code === "ok" ) {
		await sendMessage( res.data );
	} else {
		logger.error( res.error );
		await sendMessage( "图片渲染异常，请联系持有者进行反馈" );
	}
}