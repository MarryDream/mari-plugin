import { InputParameter } from "@modules/command";
import FileManagement from "@modules/file";
import { filterUserUsableCommand } from "#@help/utils/filter";
import { RenderResult } from "@modules/renderer";
import { renderer } from "#mari-plugin/init";

type HelpCommand = {
	id: number;
	header: string;
	body: string
	cmdKey: string;
	detail: string;
	pluginName: string;
}

function getVersion( file: FileManagement ): string {
	const path: string = file.getFilePath( "package.json", "root" );
	const { version } = require( path );
	return version.split( "-" )[0];
}

export async function main( i: InputParameter ): Promise<void> {
	const dbKey = "mari-plugin.help-data";
	
	const commands = await filterUserUsableCommand( i );
	if ( commands.length === 0 ) {
		await i.sendMessage( "没有可用的指令" );
		return;
	}
	
	const cmdList: HelpCommand[] = commands.map( ( cmd, cKey ) => {
		const msgSplit = cmd.getDesc().split( " " );
		const header = msgSplit.splice( 0, 1 )[0];
		const body = msgSplit.join( " " );
		return {
			id: cKey + 1,
			header,
			body,
			cmdKey: cmd.getCmdKey(),
			detail: cmd.detail,
			pluginName: cmd.pluginName
		};
	} );
	
	const cmdData: Record<string, HelpCommand[]> = {};
	for ( const cmd of cmdList ) {
		cmdData[cmd.pluginName] = cmdData[cmd.pluginName] ? [ ...cmdData[cmd.pluginName], cmd ] : [ cmd ];
	}
	await i.redis.setString( dbKey, JSON.stringify( {
		user: i.messageData.user_id,
		version: getVersion( i.file ),
		commands: cmdData
	} ) );
	
	const model = i.messageData.raw_message === "-k" ? "keys" : "normal";
	
	const res: RenderResult = await renderer.asCqCode(
		"/help.html", { model } );
	if ( res.code === "ok" ) {
		await i.sendMessage( res.data );
	} else {
		i.logger.error( res.error );
		await i.sendMessage( "图片渲染异常，请联系持有者进行反馈" );
	}
}