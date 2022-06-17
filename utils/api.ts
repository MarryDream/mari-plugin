import fetch from "node-fetch";
import { parse } from "yaml";

const __API = {
	FETCH_CHARA_DETAIL: "https://enka.shinshin.moe/u/$/__data.json",
	FETCH_ENKA_ARTIFACT: "https://mari-plugin.oss-cn-beijing.aliyuncs.com/enka/artifact.yml",
	FETCH_ENKA_CHARA: "https://mari-plugin.oss-cn-beijing.aliyuncs.com/enka/chara.yml",
	FETCH_ENKA_META: "https://mari-plugin.oss-cn-beijing.aliyuncs.com/enka/meta.yml"
};

export async function getCharaDetail( uid: number ): Promise<any> {
	const charaDetailApi = __API.FETCH_CHARA_DETAIL.replace( "$", uid.toString() );
	try {
		const result: Response = await fetch( charaDetailApi );
		return await result.json();
	} catch ( error ) {
		throw error;
	}
}

export async function getEnKaArtifact(): Promise<any> {
	try {
		const result: Response = await fetch( __API.FETCH_ENKA_ARTIFACT );
		return parse( await result.text() );
	} catch ( error ) {
		throw error;
	}
}

export async function getEnKaChara(): Promise<any> {
	try {
		const result: Response = await fetch( __API.FETCH_ENKA_CHARA );
		return parse( await result.text() );
	} catch ( error ) {
		throw error;
	}
}

export async function getEnKaMeta(): Promise<any> {
	try {
		const result: Response = await fetch( __API.FETCH_ENKA_META );
		return parse( await result.text() );
	} catch ( error ) {
		throw error;
	}
}