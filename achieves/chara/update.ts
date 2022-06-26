import { InputParameter } from "@modules/command";
import { charaDetailPromise } from "#mari-plugin/utils/promise";
import * as ApiType from "#mari-plugin/types";
import { getUID, isAt } from "../../utils/message";

export async function main( { sendMessage, messageData, redis, logger }: InputParameter ): Promise<void> {
	const msg: string = messageData.raw_message;
	const userID: number = messageData.user_id;
	
	const atID: string | undefined = isAt( msg );
	/* 检查是否绑定了uid */
	const { info } = await getUID( msg === "-c" ? "" : msg, userID, redis, atID );
	
	if ( typeof info === "string" ) {
		await sendMessage( info );
		return;
	}
	
	const uid: number = info;
	
	if ( msg === "-c" ) {
		await redis.deleteKey( `mari-plugin.chara-detail-list-${ uid }` );
		await sendMessage( `「${ uid }」的面板存储数据已清空` );
		return;
	}
	
	/* 是否为更新自己 */
	const self = !msg;
	
	let detail: ApiType.Detail;
	
	try {
		detail = await charaDetailPromise( uid, self, sendMessage, true );
	} catch ( error ) {
		if ( typeof error === "string" ) {
			await sendMessage( <string>error );
		} else {
			logger.error( error );
		}
		return;
	}
	
	const avatarNames: string = detail.avatars.map( a => a.name ).join( '，' );
	
	const msgUser = self ? "" : `用户「${ uid }」`;
	await sendMessage( `更新面板数据成功，${ msgUser }当前可查询角色列表为：${ avatarNames }` );
}