import fetch from "node-fetch";
import { parse } from "yaml";

const __API = {
	FETCH_ARTIFACT_ID: "https://mari-plugin.oss-cn-beijing.aliyuncs.com/docs/artifact_id.yml",
	FETCH_CHARA_DETAIL: "https://enka.shinshin.moe/u/$/__data.json",
	FETCH_ENKA_ARTIFACT: "https://mari-plugin.oss-cn-beijing.aliyuncs.com/enka/artifact.yml",
	FETCH_ENKA_CHARA: "https://mari-plugin.oss-cn-beijing.aliyuncs.com/enka/chara.yml",
	FETCH_ENKA_META: "https://mari-plugin.oss-cn-beijing.aliyuncs.com/enka/meta.yml"
};

export async function getArtifactId(): Promise<Record<string, string>> {
	const result: Response = await fetch(__API.FETCH_ARTIFACT_ID);
	return parse( await result.text());
}

export async function getCharaDetail( uid: number ): Promise<any> {
	const charaDetailApi = __API.FETCH_CHARA_DETAIL.replace( "$", uid.toString() );
		const result: Response = await fetch( charaDetailApi );
		return await result.json();
}

export async function getEnKaArtifact(): Promise<any> {
		const result: Response = await fetch( __API.FETCH_ENKA_ARTIFACT );
		return parse( await result.text() );
}

export async function getEnKaChara(): Promise<any> {
		const result: Response = await fetch( __API.FETCH_ENKA_CHARA );
		return parse( await result.text() );
}

export async function getEnKaMeta(): Promise<any> {
		const result: Response = await fetch( __API.FETCH_ENKA_META );
		return parse( await result.text() );
}