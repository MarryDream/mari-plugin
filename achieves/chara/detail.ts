import { BOT } from "@modules/bot";
import { InputParameter } from "@modules/command";
import { getRealName, NameResult } from "#genshin/utils/name";
import { characterID } from "#genshin/init";
import { renderer } from "#mari-plugin/init";
import { charaDetailPromise } from "#mari-plugin/utils/promise";
import { RenderResult } from "@modules/renderer";

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
	
	const charID: number = characterID.map[realName];
	
	/* 因无法获取属性，排除旅行者 */
	if ( charID === -1 ) {
		await sendMessage( `暂不支持查看「${ realName }」的面板详细信息` );
		return;
	}
	
	const uid: number = info;
	
	try {
		await charaDetailPromise( uid, userID, charID, realName, sendMessage );
	} catch ( error ) {
		logger.error( error );
		await sendMessage( <string>error );
		return;
	}
	
	const res: RenderResult = await renderer.asCqCode(
		"/chara-detail.html", { qq: userID } );
	if ( res.code === "ok" ) {
		await sendMessage( res.data );
	} else {
		logger.error( res.error );
		await sendMessage( "图片渲染异常，请联系持有者进行反馈" );
	}
}