import { defineDirective } from "@/modules/command";
import { getRealName, NameResult } from "#/genshin/utils/name";
import { characterId, config, renderer } from "#/mari-plugin/init";
import { charaDetailPromise, ErrorMsg } from "#/mari-plugin/utils/promise";
import { RenderResult } from "@/modules/renderer";
import * as ApiType from "#/mari-plugin/types";
import { typeData } from "#/genshin/init";
import { getUID, isAt } from "#/mari-plugin/utils/message";

export default defineDirective( "order", async ( { sendMessage, messageData, matchResult, redis, logger } ) => {
	const [ name, uidStr, atMsg ] = matchResult.match;
	
	if ( !config.uidQuery && uidStr ) {
		await sendMessage( "bot 持有者已关闭 uid 查询功能" );
		return;
	}
	
	const atID: string | undefined = isAt( atMsg );
	const userID: number = messageData.user_id;
	
	/* 检查是否绑定了uid */
	const { info, stranger, self } = await getUID( uidStr || atMsg, userID, redis, atID );
	
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
	const target: number = atID ? parseInt( atID ) : userID;
	
	let detail: ApiType.Detail;
	
	try {
		detail = await charaDetailPromise( uid, self, sendMessage, false );
	} catch ( error ) {
		if ( typeof error === "string" ) {
			await sendMessage( <string>error );
		} else {
			await sendMessage( "整理数据出错，请前往控制台查看错误信息" );
			logger.error( error );
		}
		return;
	}
	
	/* 获取所选角色的信息 */
	const currentChara = detail.avatars.find( a => {
		return charID === -1 ? a.id === 10000005 || a.id === 10000007 : a.id === charID;
	} );
	
	if ( !currentChara ) {
		const errorMsg = self ? ErrorMsg.SELF_NOT_FOUND : ErrorMsg.NOT_FOUND;
		await sendMessage( errorMsg.replace( "$", realName ) );
		return;
	}
	
	/* 获取所选角色属性 */
	const element = typeData.character[realName] === "!any!" ? "none" : typeData.character[realName];
	
	await redis.setString( `mari-plugin.chara-detail-${ target }`, JSON.stringify( {
		uid,
		username: detail.nickname,
		element,
		...currentChara
	} ) );
	
	const res: RenderResult = await renderer.asSegment(
		"/views/chara-detail.html", { qq: target, stranger } );
	if ( res.code === "ok" ) {
		await sendMessage( res.data );
	} else {
		throw new Error( res.error );
	}
} );