const template = `<div class="help">help</div>`

import { request, parseURL } from "../../public/js/src.js";

const { defineComponent } = Vue;

export default defineComponent( {
	name: "HelpApp",
	template,
	setup() {
		const urlParams = parseURL( location.search );
		const data = request( `/api/help` );
		
		const model = urlParams.model;
		
		const pluginNameMap = {
			"@help": "帮助指令",
			"@management": "管理指令",
			"tool": "附加工具"
		}
		
		return {
			data,
			model,
			pluginNameMap
		};
	}
} )