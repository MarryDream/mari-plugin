import * as ApiType from "#mari-plugin/types";

const artiIdx: Record<string, ApiType.ArtIdx> = {
	EQUIP_BRACER: "arti1",
	EQUIP_NECKLACE: "arti2",
	EQUIP_SHOES: "arti3",
	EQUIP_RING: "arti4",
	EQUIP_DRESS: "arti5"
};

/* 不需要带百分比的属性 */
const attrNoPercent = [ "HP", "ATTACK", "BASE_ATTACK", "DEFENSE", "ELEMENT_MASTERY" ];

const attrMap = {
	HP: "生命值",
	HP_PERCENT: "生命值",
	ATTACK: "攻击力",
	ATTACK_PERCENT: "攻击力",
	BASE_ATTACK: "基础攻击力",
	DEFENSE: "防御力",
	DEFENSE_PERCENT: "防御力",
	ELEMENT_MASTERY: "元素精通",
	CHARGE_EFFICIENCY: "元素充能效率",
	CRITICAL: "暴击率",
	CRITICAL_HURT: "暴击伤害",
	HEAL_ADD: "治疗加成",
	FIRE_ADD_HURT: "火元素伤害加成",
	ICE_ADD_HURT: "冰元素伤害加成",
	ROCK_ADD_HURT: "岩元素伤害加成",
	ELEC_ADD_HURT: "雷元素伤害加成",
	WIND_ADD_HURT: "风元素伤害加成",
	WATER_ADD_HURT: "水元素伤害加成",
	PHYSICAL_ADD_HURT: "物理伤害加成"
};

export class EnKa {
	private readonly artifact: ApiType.EnKaArtifact;
	
	constructor(
		private readonly meta: ApiType.EnKaMeta,
		private readonly chara: ApiType.EnKaChara,
		artifact: ApiType.EnKaArtifact
	) {
		const formatArtifact: ApiType.EnKaArtifact = {};
		Object.values( artifact ).forEach( art => {
			formatArtifact[art.name] = art;
		} )
		this.artifact = formatArtifact;
	}
	
	/* 获取用户数据 */
	public getDetailInfo( data: any ): ApiType.Detail {
		const avatars: ApiType.Avatar[] = data.avatarInfoList.map( chara => {
			const avatarId = chara["avatarId"];
			return {
				id: avatarId,
				updateTime: new Date().getTime(),
				level: chara.propMap['4001'].val * 1,
				fetter: chara.fetterInfo.expLevel,
				weapon: this.getWeapon( chara.equipList ),
				artifact: this.getArtifact( chara.equipList ),
				talent: chara.talentIdList ? <number>chara.talentIdList.length : 0,
				skill: this.getSkill( avatarId, chara.skillLevelMap, chara.proudSkillExtraLevelMap )
			}
		} )
		return {
			nickname: data.playerInfo.nickname,
			avatars,
		}
	}
	
	/* 获取武器信息 */
	private getWeapon( data: any[] ): ApiType.Weapon {
		const { weapon, flat } = data.find( d => d.flat?.itemType === "ITEM_WEAPON" );
		const attrs: ApiType.ArtAttr[] = flat.weaponStats.map( s => {
			return this.getArtInfo( s );
		} );
		
		return {
			name: this.meta[flat.nameTextMapHash],
			star: flat.rankLevel,
			level: weapon.level,
			promote: weapon.promoteLevel,
			affix: ( <number>Object.values( weapon.affixMap )[0] || 0 ) + 1,
			attrs
		}
	}
	
	/* 获取圣遗物信息 */
	private getArtifact( data: any[] ): { list: ApiType.Artifact, effects: ApiType.Effect[] } {
		/* 圣遗物属性对象 */
		const ret: ApiType.Artifact = {};
		
		/* 统计圣遗物套装 */
		const tmpSetBucket: Record<string, any> = {};
		
		for ( const { flat, reliquary } of data ) {
			/* 圣遗物属性列表 */
			const sub: { appendPropId: string; statValue: number }[] = flat.reliquarySubstats;
			/* 圣遗物部位编号 */
			const artIdx = artiIdx[flat.equipType];
			if ( !artIdx ) continue;
			
			const artShirtName = this.meta[flat.setNameTextMapHash] || "";
			
			const artInfo = this.artifact[artShirtName];
			const artSet = artInfo.sets[artIdx];
			
			ret[artIdx] = {
				shirtName: artShirtName,
				artifactName: artSet.name,
				level: Math.min( 20, ( reliquary?.level || 1 ) - 1 ),
				mainAttr: this.getArtInfo( flat.reliquaryMainstat ),
				subAttr: sub.map( s => this.getArtInfo( s ) )
			}
			/* 存放圣遗物套装信息 */
			const t = tmpSetBucket[artShirtName];
			tmpSetBucket[artShirtName] = {
				count: t?.count ? t.count + 1 : 1,
				effect: t?.effect ?? artInfo.effect
			}
		}
		
		/* 套装属性对象 */
		const effects: ApiType.Effect[] = [];
		for ( const key of Object.keys( tmpSetBucket ) ) {
			const { count, effect } = tmpSetBucket[key];
			for ( const num in effect ) {
				if ( count >= num ) {
					effects.push( {
						name: key,
						count: parseInt( num ),
						effect: effect[num]
					} )
				}
			}
		}
		
		return { list: ret, effects };
	}
	
	/* 获取天赋信息 */
	private getSkill( charId: string, skillLevelMap: Record<string, number>, extSkillLevelMap: Record<string, number> = {} ): ApiType.Skill {
		let { Skills, ProudMap } = this.chara[charId];
		let idx = 1;
		/* 映射对象，a 普攻 s 战技 e 爆发 */
		const idxMap = { a: "a", s: "e", e: "q" };
		
		/* 天赋 数字id/额外等级 与 技能类型的映射 */
		const skillTypeMap: Record<string, string> = {};
		
		/* 存放 天赋 数字id 与 技能类型的映射 */
		for ( const sId in Skills ) {
			const skillsIdName = Skills[sId];
			/* 提取 Skill_S_Itto_01 中的 S */
			const exec = /skill_(\w)/.exec( skillsIdName.toLowerCase() );
			skillTypeMap[sId] = idxMap[<string>( exec && exec[1] )];
		}
		
		/* 存放 天赋额外等级 数字id 与 技能类型的映射 */
		for ( const sId in ProudMap ) {
			const sExtId = ProudMap[sId];
			skillTypeMap[sExtId] = skillTypeMap[sId];
		}
		/* 技能等级对象，技能类型：等级 */
		const skillInfo: ApiType.Skill = {};
		
		/* 设置天赋基础等级 */
		for ( const sId in skillLevelMap ) {
			const skillType = skillTypeMap[sId];
			const skillLevel = skillLevelMap[sId];
			skillInfo[skillType] = {
				level: skillLevel,
				ext: false
			};
		}
		
		/* 设置总天赋等级： 基础+额外 */
		for ( const sExtId in extSkillLevelMap ) {
			const skillType = skillTypeMap[sExtId];
			const extSkillLevel = extSkillLevelMap[sExtId];
			if ( skillInfo[skillType] ) {
				skillInfo[skillType].level = skillInfo[skillType].level + extSkillLevel;
				skillInfo[skillType].ext = true;
			}
		}
		
		return skillInfo;
	}
	
	/* 获取圣遗物属性信息，[属性名, 值] */
	private getArtInfo( data: { mainPropId?: string; appendPropId?: string; statValue: number } ): ApiType.ArtAttr {
		let propId = data.appendPropId || data.mainPropId || "";
		propId = propId.replace( "FIGHT_PROP_", "" );
		
		if ( !attrMap[propId] ) {
			return {
				attr: "",
				value: ""
			}
		}
		
		const percentMark = attrNoPercent.includes( propId ) ? "" : "%";
		
		return {
			attr: attrMap[propId],
			value: data.statValue.toString() + percentMark
		}
	}
}