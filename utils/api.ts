import fetch from "node-fetch";
import { parse } from "yaml";
import { AttrIconMap, EnKa, EnKaArtifact, EnKaChara, EnKaMeta } from "#/mari-plugin/types";

const __API = {
	FETCH_COMMITS_INFO: "https://api.github.com/repos/MarryDream/mari-plugin/commits",
	FETCH_CHARACTER_ID: "https://mari-plugin.oss-cn-beijing.aliyuncs.com/docs/character_id.yml",
	FETCH_ARTIFACT_ID: "https://mari-plugin.oss-cn-beijing.aliyuncs.com/docs/artifact_id.yml",
	/* enka */
	FETCH_CHARA_DETAIL: "api/uid/$",
	FETCH_ENKA_ARTIFACT: "https://mari-plugin.oss-cn-beijing.aliyuncs.com/enka/artifact.yml",
	FETCH_ENKA_CHARA: "https://mari-plugin.oss-cn-beijing.aliyuncs.com/enka/chara.yml",
	FETCH_ENKA_META: "https://mari-plugin.oss-cn-beijing.aliyuncs.com/enka/meta.yml",
	FETCH_ATTR_ICON: "https://mari-plugin.oss-cn-beijing.aliyuncs.com/docs/attr_icon.yml"
};

/* 检查更新 */
export async function getCommitsInfo(): Promise<any[]> {
	const result = await fetch( __API.FETCH_COMMITS_INFO );
	return await result.json();
}

export async function getCharacterId(): Promise<Record<string, number>> {
	const result = await fetch( __API.FETCH_CHARACTER_ID );
	return parse( await result.text() );
}

export async function getArtifactId(): Promise<Record<string, string>> {
	const result = await fetch( __API.FETCH_ARTIFACT_ID );
	return parse( await result.text() );
}

export async function getCharaDetail( origin: string, uid: number ): Promise<EnKa> {
	const charaDetailApi = origin + __API.FETCH_CHARA_DETAIL.replace( "$", uid.toString() );
	
	const result = await fetch( charaDetailApi, {
		headers: {
			"User-Agent": `mari-plugin/1.0`
		}
	} );
	return await result.json();
}

export async function getEnKaArtifact(): Promise<EnKaArtifact> {
	const result = await fetch( __API.FETCH_ENKA_ARTIFACT );
	return parse( await result.text() );
}

export async function getEnKaChara(): Promise<EnKaChara> {
	const result = await fetch( __API.FETCH_ENKA_CHARA );
	return parse( await result.text() );
}

export async function getEnKaMeta(): Promise<EnKaMeta> {
	const result = await fetch( __API.FETCH_ENKA_META );
	return parse( await result.text() );
}

export async function getAttrIcon(): Promise<AttrIconMap> {
	const result = await fetch( __API.FETCH_ATTR_ICON );
	return parse( await result.text() );
}