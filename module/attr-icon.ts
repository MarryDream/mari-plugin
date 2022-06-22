import { scheduleJob } from "node-schedule";
import { getAttrIcon } from "#mari-plugin/utils/api";
import { AttrIconMap } from "#mari-plugin/types";

export class AttrIcon {
	public map: AttrIconMap = {};
	
	constructor() {
		this.initData().then();
		scheduleJob( "0 0 0 * * *", this.initData );
	}
	
	private async initData() {
		this.map = await getAttrIcon();
	}
}