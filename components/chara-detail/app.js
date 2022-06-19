const template = `<div class="chara-detail">
	<div class="user-info"></div>
</div>`;

import { request, parseURL } from "../../public/js/src.js";

const { defineComponent, computed, onMounted } = Vue;

export default defineComponent( {
	name: "CharaDetailApp",
	template,
	components: {},
	setup() {
		const urlParams = parseURL( location.search );
		const data = request( `/api/chara?qq=${ urlParams.qq }` );
		
		const styleMap = {
			anemo: [ "120deg", "120deg" ],
			cryo: [ "165deg", "165deg" ],
			dendro: [ "85deg", "85deg" ],
			electro: [ "240deg", "240deg" ],
			geo: [ "0deg", "0deg" ],
			hydro: [ "180deg", "180deg" ],
			pyro: [ "315deg", "315deg" ],
			none: [ "0deg", "0deg" ]
		}
		
		// 圣遗物默认图标
		const artifactsFontIcon = [ "icon-flower", "icon-plume", "icon-sands", "icon-goblet", "icon-circle" ]
		
		onMounted( () => {
			const elemStyle = styleMap[data.element];
			document.documentElement.style.setProperty( "--bg-hue-rotate", elemStyle[0] );
			document.documentElement.style.setProperty( "--talent-hue-rotate", elemStyle[1] );
		} )
		
		/* 给圣遗物添加种类图标 */
		const artifacts = computed( () => data.artifacts.list.map(( a, aKey) => {
			return {
				...a,
				typeIcon: artifactsFontIcon[aKey]
			}
		}) )
		
		const userAvatar = computed( () => `https://q1.qlogo.cn/g?b=qq&s=640&nk=${ urlParams.qq }` );
		
		const portrait = computed( () => {
			return `https://mari-plugin.oss-cn-beijing.aliyuncs.com/image/portrait/${ data.id }.png`;
		} );
		
		return {
			data,
			artifacts,
			urlParams,
			userAvatar,
			portrait
		}
	}
} );
