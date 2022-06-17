const template = `<div class="chara-detail">面板详情</div>`;

import { request, parseURL } from "../../public/js/src.js";

const { defineComponent, computed } = Vue;

export default defineComponent( {
	name: "CharaDetailApp",
	template,
	components: {},
	setup() {
		const urlParams = parseURL( location.search );
		const data = request( `/api/chara?qq=${ urlParams.qq }` );
		return { data, urlParams }
	}
} );
