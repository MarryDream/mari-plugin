import bot from "ROOT";
import Database from "@modules/database";
import { AuthLevel } from "../../../modules/management/auth";
import { Order } from "../../../modules/command";

interface UIDResult {
	info: number | string;
	stranger: boolean;
	self: boolean;
}

export function isAt( message: string ): string | undefined {
	const res: RegExpExecArray | null = /\[cq:at,qq=(?<id>\d+)/.exec( message );
	return res?.groups?.id;
}

export async function getUID( data: string, userID: number, redis: Database, atID?: string ): Promise<UIDResult> {
	if ( !data ) {
		const a: AuthLevel = await bot.auth.get( userID );
		const COMMAND_BIND = <Order>bot.command.getSingle( "silvery-star.bind", a );
		const uid: string = await redis.getString( `silvery-star.user-bind-uid-${ userID }` );
		const info = uid.length === 0 ? `您还未绑定游戏UID，请使用 ${ COMMAND_BIND.getHeaders()[0] }+游戏UID 绑定` : parseInt( uid );
		return { info, stranger: false, self: true };
	} else if ( atID ) {
		const uid: string = await redis.getString( `silvery-star.user-bind-uid-${ atID }` );
		const info = uid.length === 0 ? `用户 ${ atID } 未绑定游戏UID` : parseInt( uid );
		return { info, stranger: false, self: false };
	} else {
		return { info: parseInt( data ), stranger: true, self: false };
	}
}