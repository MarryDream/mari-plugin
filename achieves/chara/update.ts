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
	
	await sendMessage( "开始更新面板数据，请稍后……" );
	
	const uid: number = info;
	
	const dbKey: string = `mari-plugin.chara-detail-list-${ uid }`;
	
	const detailStr: string = await redis.getString( dbKey );
	const oldDetail: ApiType.Detail | null = detailStr ? JSON.parse( detailStr ) : null;
	
	/* 获取旧头像列表 */
	let oldAvatars: ApiType.Avatar[] = oldDetail ? oldDetail.avatars : [];
	
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
	
	const newAvatarNames: string = detail.avatars.map( a => a.name ).join( '，' );
	
	/* 组装新旧头像 */
	oldAvatars = oldAvatars.filter( oa => detail.avatars.findIndex( na => oa.id === na.id ) === -1 );
	detail.avatars = detail.avatars.concat( oldAvatars );
	
	await redis.setString( dbKey, JSON.stringify( detail ) );
	
	await sendMessage( `更新面板数据成功，本次更新角色列表为：${ newAvatarNames }` );
}