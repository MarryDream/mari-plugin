import bot from "ROOT";

export function getVersion(): string {
	const path: string = bot.file.getFilePath( "package.json", "root" );
	const { version } = require( path );
	return version.split( "-" )[0];
}