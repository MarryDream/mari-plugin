import { defineDirective } from "@/modules/command";
import { charaDetailPromise } from "#/mari-plugin/utils/promise";
import * as ApiType from "#/mari-plugin/types";
import { getUID, isAt } from "../../utils/message";
import { config } from "#/mari-plugin/init";


export default defineDirective( "order", async ( { sendMessage, messageData, matchResult, redis, logger } ) => {
	const msg: string = matchResult.match[0];
	const userID: number = messageData.user_id;
	
	const isClear = msg === "-c";
	const atID: string | undefined = isAt( msg );
	const isUid = msg && !isClear && !atID;
	
	if ( !config.uidQuery && isUid ) {
		await sendMessage( "bot 持有者已关闭 uid 更新功能" );
		return;
	}
	
	/* 检查是否绑定了uid */
	const { info } = await getUID( isClear ? "" : msg, userID, redis, atID );
	
	if ( typeof info === "string" ) {
		await sendMessage( info );
		return;
	}
	
	const uid: number = info;
	if ( isClear ) {
		await redis.deleteKey( `mari-plugin.chara-detail-list-${ uid }` );
		await sendMessage( `「${ uid }」的面板存储数据已清空` );
		return;
	}
	
	/* 是否为更新自己 */
	const self = !msg;
	
	let detail: ApiType.Detail;
	
	try {
		detail = await charaDetailPromise( uid, self, sendMessage, true );
	} catch ( error: any ) {
		if ( typeof error === "string" ) {
			await sendMessage( <string>error );
		} else {
			logger.error( error.stack || error.message || error );
		}
		return;
	}
	
	const avatarNames: string = detail.avatars.map( a => a.name ).join( '，' );
	
	const msgUser = self ? "" : `用户「${ uid }」`;
	await sendMessage( `更新面板数据成功，${ msgUser }当前可查询角色列表为：${ avatarNames }` );
} );