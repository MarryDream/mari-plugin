import { scheduleJob } from "node-schedule";
import { getCharacterID } from "#genshin/utils/api";

export class CharacterId {
	public map: Record<string, number> = {};
	public idMap: Record<string, string> = {};
	
	constructor() {
		this.initData().then();
		scheduleJob( "0 0 0 * * *", this.initData );
	}

	private async initData() {
		this.map = await getCharacterID();
		for ( const name in this.map ) {
			this.idMap[this.map[name]] = name;
		}
	}
}