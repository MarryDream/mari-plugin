import { InputParameter } from "@modules/command";

export async function main( { sendMessage }: InputParameter ): Promise<void> {
	await sendMessage( "角色详情" )
}