import fetch from "node-fetch";

const __API = {
	FETCH_CHARA_DETAIL: "https://enka.shinshin.moe/u/$/__data.json"
};

export async function getCharaDetail( uid: number ) {
	const charaDetailApi = __API.FETCH_CHARA_DETAIL.replace( "$", uid.toString() );
	try {
		const result: Response = await fetch( charaDetailApi );
		if ( result.status !== 404 ) {
			return Promise.resolve( await result.json() );
		}
		return Promise.reject( new Error( "" ) );
	} catch ( error ) {
		return Promise.reject( error );
	}
}