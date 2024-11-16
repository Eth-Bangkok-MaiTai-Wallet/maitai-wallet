import { clusters } from "@/lib/classification";
import { classify, EmbeddingSimilarityClassifier, generateObject, openai, zodSchema, jsonObjectPrompt, runTools } from "modelfusion";
import { NextResponse } from "next/server";
import { z } from "zod";

export const config = { runtime: "edge" };


const messageSchema = z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string(),
  });
  
const requestSchema = z.array(messageSchema);


export default async function classifyMessage (req: any, res: any) {

    // if (req.method !== "POST") {
    //     return new Response(
    //     JSON.stringify({
    //         error: `Method ${req.method} not allowed. Only POST allowed.`,
    //     }),
    //     { status: 405, headers: { "Content-Type": "application/json" } }
    //     );
    // }

    const parsedData = requestSchema.safeParse(await req.json());
    console.log(parsedData)


    if (parsedData.success === false) {
        return new Response(
            JSON.stringify({
            error: `Could not parse content. Error: ${parsedData.error}`,
            }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }


    const messages = parsedData.data;
    const lastMessage = messages[messages.length - 1];

    // const classifier = new EmbeddingSimilarityClassifier({
    //     embeddingModel: openai.TextEmbedder({
    //       model: "text-embedding-ada-002",
    //     }),
    //     similarityThreshold: 0.82,
    //     clusters: clusters
    // });

    // const result = await classify({
    //     model: classifier,
    //     value: lastMessage.content,
    // });

    // let classificationResult = null;

    // switch (result) {
    //     case "eth_transfer_to_address":
    //         classificationResult = "eth_transfer_to_address";
    //         break;
    //     case "eth_transfer_to_ens":
    //         classificationResult = "eth_transfer_to_ens"; 
    //         break;
    //     case "eth_transfer_to_basename":
    //         classificationResult = "eth_transfer_to_basename";
    //         break;
    //     case "erc20_transfer_to_address":
    //         classificationResult = "erc20_transfer_to_address";
    //         break;
    //     case "erc20_transfer_to_ens":
    //         classificationResult = "erc20_transfer_to_ens";
    //         break;
    //     case "erc20_transfer_to_basename":
    //         classificationResult = "erc20_transfer_to_basename";
    //         break;
    //     case "erc20_swap":
    //         classificationResult = "erc20_swap";
    //         break;
    //     case "erc721_transfer":
    //         classificationResult = "erc721_transfer";
    //         break;
    //     case "erc721_mint":
    //         classificationResult = "erc721_mint";
    //         break;
    //     case null:
    //         classificationResult = "null";
    //         break;
    // }

    // console.log("Classification Result: ", classificationResult);

    // const { text, toolResults } = await runTools({
    //   model: openai.ChatTextGenerator({ model: "gpt-4-1106-preview" }),
    //   tools: [tokenLookup, websearchTool],
    //   prompt: [openai.ChatMessage.user(
    //     "You are receiving a user input related to a ethereum transaction. " +
    //     `The input has been classified as ${classificationResult}. ` +
    //     "Use the available tokenLookup tool to find the token data. " +
    //     "If in doubt, do a websearch to confirm the token name or symbol and choose the token with the biggest market cap." +
    //     "Respond the JSON object of the correct token data."
    //   )],
    // });
    
    // if (text != null) {
    //   console.log(`No result found`);
    //   // return;
    // } else {
    //   console.log(`Result found: ${text}`);
    // }

    // console.log("Tool Results: ", toolResults);
    
    // for (const { tool, toolCall, args, ok, result } of toolResults ?? []) {
    //   console.log(`Tool call:`, toolCall);
    //   console.log(`Tool:`, tool);
    //   console.log(`Arguments:`, args);
    //   console.log(`Ok:`, ok);
    //   console.log(`Result or Error:`, result);
    // }

    // const contractCall = await formatContractCall(lastMessage.content, classificationResult, text!);

    // console.log("Contract Call: ", contractCall);

    const testJson = {
      role: "user",
      content: "value",
    }
    return NextResponse.json(testJson);
    // return new Response(JSON.stringify(testJson), {
    //   status: 200,
    //   headers: {
    //     "Content-Type": "application/json"
    //   }
    // });


    // return new Response(JSON.stringify(testJson), {
    //     headers: {
    //       "Content-Type": "application/json",
    //       "Cache-Control": "no-cache",
    //       Connection: "keep-alive",
    //       "Content-Encoding": "none",
    //     },
    // });
}


// const gpt4Model = openai.ChatTextGenerator({
//   // explicit API configuration needed for NextJS environment
//   // (otherwise env variables are not available):
//   api: openai.Api({
//     apiKey: process.env.OPENAI_API_KEY,
//   }),
//   model: "gpt-4-1106-preview",
//   maxGenerationTokens: 1000,
// });

// const formatContractCall = (messages: string, classificationResult: string, tokenData: string) =>
//   generateObject({
//     model: gpt4Model.asObjectGenerationModel(jsonObjectPrompt.text()),

//     schema: zodSchema(
//       z.object({
//         contracts: z.array(
//           z.object({
//             address: z.string().describe("The contract address"),
//             abi: z.string().describe("The contract abi"),
//             functionName: z.string().describe("The function name, probably e.g. `transfer` for erc20 token transfer"),
//             args: z.array(z.string()).describe("The function arguments, the required input parameters for the function"),
//           })
//         ),
//       })
//     ),

//     prompt:
//       `Based on this conversation ### ${messages} ### classified as ### ${classificationResult} ### and this token data ### ${tokenData} ###, formulate the transaction object for the coinbase sdk`
// });
