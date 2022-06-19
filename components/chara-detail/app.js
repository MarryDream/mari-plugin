const template = `<div class="chara-detail">
	<div class="portrait-box">
		<img class="portrait" :src="portrait" alt="portrait">
	</div>
	<div class="detail-left">
		<div class="user">
			<img :src="userAvatar" alt="avatar">
			<div class="user-info">
				<p>UID {{ data.uid }}</p>
				<p>{{ data.username }}</p>
			</div>
		</div>
		<div class="base-info card">
			<div v-for="(a, aKey) of data.overview" :key="aKey" class="list-item">
				<p class="base-info-label">
					<i class="icon-flower"></i>
					<span class="label">{{ a.attr }}</span>
				</p>
				<p class="base-info-value">
					<span>{{ a.resultValue }}</span>
					<span v-if="a.extraValue" class="extra">(+{{ a.extraValue }})</span>
				</p>
			</div>
		</div>
		<div class="talent">
			<p class="model-title">命座</p>
			<ul class="talent-content">
				<li v-for="t in 6" :class="{ block: t > data.talent }" :key="t">
					<img :src="getTalentIcon(t)" :alt="'talent' + t">
				</li>
			</ul>
		</div>
		<div class="skill">
			<p class="model-title">天赋</p>
			<ul class="skill-content">
				<li v-for="(s, sKey) of data.skill" :key="sKey">
					<img :src="getSkillIcon(sKey)" :alt="'skill' + sKey + 1">
					<div class="skill-level" :class="{ special: s.ext }">
						<span>{{ s.level }}</span>
					</div>
				</li>
			</ul>
		</div>
	</div>
	<div class="detail-right">
		<div class="avatar-info">
			<p>
				<span class="avatar-name">{{ data.name }}</span>
				<p class="level-info">Lv{{ data.level }}</p>
				<p class="talent-info">{{ data.talent }}命</p>
			</p>
			<p class="fetter-info">好感度等级：{{ data.fetter }}</p>
		</div>
	</div>
	<div class="author">Create By Adachi-BOT</div>
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
			hydro: [ "170deg", "176deg" ],
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
		const artifacts = computed( () => data.artifacts.list.map( ( a, aKey ) => {
			return {
				...a,
				typeIcon: artifactsFontIcon[aKey]
			}
		} ) )
		
		const userAvatar = computed( () => `https://q1.qlogo.cn/g?b=qq&s=640&nk=${ urlParams.qq }` );
		
		const portrait = computed( () => {
			return `https://mari-plugin.oss-cn-beijing.aliyuncs.com/image/character/${ data.id }/gacha_splash.png`;
		} );
		
		function getTalentIcon( talentKey ) {
			return `https://mari-plugin.oss-cn-beijing.aliyuncs.com/image/character/${ data.id }/cons_${ talentKey }.png`
		}
		
		function getSkillIcon( skillKey ) {
			return `https://mari-plugin.oss-cn-beijing.aliyuncs.com/image/character/${ data.id }/talent_${ skillKey }.png`
		}
		
		return {
			data,
			artifacts,
			urlParams,
			userAvatar,
			portrait,
			getTalentIcon,
			getSkillIcon
		}
	}
} );


