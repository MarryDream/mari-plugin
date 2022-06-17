/**
 * @interface
 * 圣遗物属性信息
 * @attr 圣遗物属性名
 * @value 圣遗物属性值
 */
export interface ArtAttr {
	attr: string;
	value: string;
}

/**
 * @interface
 * 圣遗物信息
 * @shirtName 套装名称
 * @artifactName 单件名称
 * @level 等级
 * @mainAttr 主属性信息
 * @subAttr 副属性信息组
 */
export interface ArtifactInfo {
	shirtName: string;
	artifactName: string;
	level: number;
	mainAttr: ArtAttr;
	subAttr: ArtAttr[];
}

/**
 * @interface
 * 天赋信息
 * @level 等级
 * @ext 等级是否存在额外加成
 */
export interface SkillInfo {
	level: number;
	ext: boolean;
}

/**
 * @interface
 * 武器属性
 * @name 名称
 * @star 星级
 * @level 等级
 * @promote 突破层数
 * @affix 精炼次数
 * @attrs 属性列表
 */
export interface Weapon {
	name: string;
	star: number;
	level: number;
	promote: number;
	affix: number;
	attrs: ArtAttr[];
}

/**
 * @interface
 * 圣遗物套装效果
 * @name 套装名
 * @count 几件套
 * @effect 套装效果
 */
export interface Effect {
	name: string;
	count: number;
	effect: string;
}

/**
 * @interface
 * 角色信息
 * @id 角色编号
 * @updateTime 更新日期(时间戳)
 * @level 等级
 * @fetter 好感度
 * @weapon 武器信息
 * @artifact 圣遗物信息
 * @talent 命座层数
 * @skill 天赋信息
 */
export interface Avatar {
	id: number;
	updateTime: number;
	level: number;
	fetter: number;
	weapon: Weapon;
	artifact: {
		list: Artifact;
		effects: Effect[];
	};
	talent: number;
	skill: Skill;
}

export type Artifact = Record<string, ArtifactInfo>
export type Skill = Record<string, SkillInfo>

export interface Detail {
	nickname: string
	avatars: Avatar[];
}