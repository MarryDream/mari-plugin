import { BOT } from "@modules/bot";
import { InputParameter } from "@modules/command";
import { getCharaDetail } from "#mari-plugin/utils/api";

async function getUID( userID: number, redis: BOT["redis"] ): Promise<number | string> {
	const uid: string = await redis.getString( `silvery-star.user-bind-uid-${ userID }` );
	return uid.length ? parseInt( uid ) : "您还未绑定游戏UID";
}

export async function main( { sendMessage, messageData, redis, logger, client }: InputParameter ): Promise<void> {
	const chara: string = messageData.raw_message;
	const userID: number = messageData.user_id;
	
	await sendMessage( "初次使用，正在获取数据，请稍后……" );
	const info = await getUID( userID, redis );
	
	if ( typeof info === "string" ) {
		await sendMessage( info );
		return;
	}
	const uid: number = info;
	
	const data = await getCharaDetail( uid );
	console.log( data );
	
	await sendMessage( "角色详情" )
}