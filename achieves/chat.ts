import { InputParameter } from "@/modules/command";
import { Configuration, CreateChatCompletionResponse, OpenAIApi } from "openai";
import { config } from "#mari-plugin/init";

interface IChatMessage {
	role: "system" | "user" | "assistant";
	content: string
}

const configuration = new Configuration( {
	apiKey: config.openAiKey,
} );

const openai = new OpenAIApi( configuration );
const messagesInit: IChatMessage[] = [
	{ "role": "system", "content": "你是一个二次元猫娘。" }
]

export async function main( { sendMessage, messageData, redis }: InputParameter ): Promise<void> {
	const msg: string = messageData.raw_message;
	const userID: number = messageData.user_id;
	
	const dbKey = `marry-dream.chat-${ userID }`;
	const loadingDbKey = `marry-dream.chat-loading-${ userID }`;
	
	const loading = await redis.getString( loadingDbKey );
	
	if ( loading ) {
		await sendMessage( "安达还在思考你的问题喵~" );
		return;
	}
	
	await redis.setString( loadingDbKey, "true" );
	
	const messagesStr: string = await redis.getString( dbKey );
	
	const messages: IChatMessage[] = messagesStr
		? JSON.parse( messagesStr )
		: [
			...messagesInit,
			{ role: "user", content: msg }
		]
	
	let data: CreateChatCompletionResponse;
	
	try {
		const res = await openai.createChatCompletion( {
			model: "gpt-3.5-turbo",
			messages
		} );
		data = res.data;
	} catch ( error ) {
		if ( ( <any>error ).response ) {
			console.error( ( <any>error ).response.status, ( <any>error ).response.data );
		} else {
			await sendMessage( `${ ( <any>error ).message }, 出错了喵~` )
		}
		await redis.deleteKey( loadingDbKey );
		return;
	}
	
	const message = data.choices[0].message;
	
	if ( message ) {
		messages.push( message );
		await redis.setString( dbKey, JSON.stringify( messages ) );
		await sendMessage( message.content );
	} else {
		await sendMessage( "出错了喵~" )
	}
	await redis.deleteKey( loadingDbKey );
}