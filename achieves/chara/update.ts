import { BOT } from "@modules/bot";
import { InputParameter } from "@modules/command";
import { charaDetailPromise } from "#mari-plugin/utils/promise";
import * as ApiType from "#mari-plugin/types";

async function getUID( userID: number, redis: BOT["redis"] ): Promise<number | string> {
	const uid: string = await redis.getString( `silvery-star.user-bind-uid-${ userID }` );
	return uid.length ? parseInt( uid ) : "您还未绑定游戏UID";
}

export async function main( { sendMessage, messageData, redis, logger }: InputParameter ): Promise<void> {
	const userID: number = messageData.user_id;
	
	/* 检查是否绑定了uid */
	const info = await getUID( userID, redis );
	if ( typeof info === "string" ) {
		await sendMessage( info );
		return;
	}
	
	const uid: number = info;
	
	if ( messageData.raw_message === "-c" ) {
		await redis.deleteKey( `mari-plugin.chara-detail-list-${ uid }` );
		await sendMessage( `「${ uid }」的面板存储数据已清空` );
		return;
	}
	
	let detail: ApiType.Detail;
	
	try {
		detail = await charaDetailPromise( uid, userID, sendMessage, true );
	} catch ( error ) {
		if ( typeof error === "string" ) {
			await sendMessage( <string>error );
		} else {
			logger.error( error );
		}
		return;
	}
	
	const avatarNames: string = detail.avatars.map( a => a.name ).join( '，' );
	
	await sendMessage( `更新面板数据成功，当前可查询角色列表为：${ avatarNames }` );
}