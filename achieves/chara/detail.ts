import { InputParameter } from "@modules/command";
import { getRealName, NameResult } from "#genshin/utils/name";
import { characterId, renderer } from "#mari-plugin/init";
import { charaDetailPromise, ErrorMsg } from "#mari-plugin/utils/promise";
import { RenderResult } from "@modules/renderer";
import * as ApiType from "#mari-plugin/types";
import { typeData } from "#genshin/init";
import Database from "../../../../modules/database";

interface UIDResult {
	info: number | string;
	stranger: boolean;
	self: boolean;
}

function isAt( message: string ): string | undefined {
	const res: RegExpExecArray | null = /\[cq:at,qq=(?<id>\d+)/.exec( message );
	return res?.groups?.id;
}

async function getUID( data: string, userID: number, redis: Database, atID?: string ): Promise<UIDResult> {
	if ( !data ) {
		const uid: string = await redis.getString( `silvery-star.user-bind-uid-${ userID }` );
		const info = uid.length === 0 ? "您还未绑定游戏UID" : parseInt( uid );
		return { info, stranger: false, self: true };
	} else if ( atID ) {
		const uid: string = await redis.getString( `silvery-star.user-bind-uid-${ atID }` );
		const info = uid.length === 0 ? `用户 ${ atID } 未绑定游戏UID` : parseInt( uid );
		return { info, stranger: false, self: false };
	} else {
		return { info: parseInt( data ), stranger: true, self: false };
	}
}

export async function main( { sendMessage, messageData, redis, logger }: InputParameter ): Promise<void> {
	const msg: string = messageData.raw_message;
	
	const parser = /(\d{9})?\s*(\[CQ:at,qq=\d+.*])?\s*([\u4e00-\u9fa5]+)/i;
	const execRes = parser.exec( msg );
	if ( !execRes ) {
		await sendMessage( "指令格式有误" );
		return;
	}
	
	const reg = execRes;
	const [ , uidStr, atMsg, name ] = reg;
	
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
	
	const res: RenderResult = await renderer.asCqCode(
		"/chara-detail.html", { qq: target, stranger } );
	if ( res.code === "ok" ) {
		await sendMessage( res.data );
	} else {
		logger.error( res.error );
		await sendMessage( "图片渲染异常，请联系持有者进行反馈" );
	}
}