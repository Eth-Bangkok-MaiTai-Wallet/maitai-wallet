import { clusters } from "@/lib/classification";
import { classify, EmbeddingSimilarityClassifier, generateObject, openai, zodSchema, jsonObjectPrompt, runTools, executeTool } from "modelfusion";
import { z } from "zod";
import { NextResponse } from "next/server";


const gpt4Model = openai.ChatTextGenerator({
  // explicit API configuration needed for NextJS environment
  // (otherwise env variables are not available):
  api: openai.Api({
    apiKey: process.env.OPENAI_API_KEY,
  }),
  model: "gpt-4-1106-preview",
  maxGenerationTokens: 1000,
});

export const config = { runtime: "edge" };


const messageSchema = z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string(),
  });
  
const requestSchema = z.array(messageSchema);


export default async function classifyMessage (req: any, res: any) {


    if (req.method !== "POST") {
        return new Response(
        JSON.stringify({
            error: `Method ${req.method} not allowed. Only POST allowed.`,
        }),
        { status: 405, headers: { "Content-Type": "application/json" } }
        );
    }

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

    const classifier = new EmbeddingSimilarityClassifier({
        embeddingModel: openai.TextEmbedder({
          model: "text-embedding-ada-002",
        }),
        similarityThreshold: 0.82,
        clusters: clusters
    });

    const result = await classify({
        model: classifier,
        value: lastMessage.content,
    });

    let classificationResult = null;

    switch (result) {
        case "eth_transfer_to_address":
            classificationResult = "eth_transfer_to_address";
            break;
        case "eth_transfer_to_ens":
            classificationResult = "eth_transfer_to_ens"; 
            break;
        case "eth_transfer_to_basename":
            classificationResult = "eth_transfer_to_basename";
            break;
        case "erc20_transfer_to_address":
            // classificationResult = "erc20_transfer_to_address";
            console.log(result);
            const tokenDataResult = await extractTokenData(lastMessage.content, result);
            console.log("Token Data Result: ", tokenDataResult);
            const tokenData = tokenDataResult.tokenData[0];
            console.log("Token Data: ", tokenData);
            const tokens = await tokenList(tokenData.tokenSymbol, tokenData.tokenName);
            console.log("Tokens: ", tokens);
            const contractCall = await formatContractCall(lastMessage.content, result, tokens);
            console.log("Contract Call: ", contractCall);
            return NextResponse.json(contractCall);
            break;
        case "erc20_transfer_to_ens":
            classificationResult = "erc20_transfer_to_ens";
            break;
        case "erc20_transfer_to_basename":
            classificationResult = "erc20_transfer_to_basename";
            break;
        case "erc20_swap":
            classificationResult = "erc20_swap";
            break;
        case "erc721_transfer":
            classificationResult = "erc721_transfer";
            break;
        case "erc721_mint":
            classificationResult = "erc721_mint";
            break;
        case null:
          return NextResponse.json({contracts: null});
    }

    console.log("Classification Result: ", classificationResult);

    // const tokens = await tokenList({ token_symbol: "DAI", token_name: "DAI Stablecoin" });

    // console.log("Tokens: ", tokens);

    const contractCall = await formatContractCall(lastMessage.content, classificationResult, "");

    console.log("Contract Call: ", contractCall);

    return NextResponse.json({});
};


const formatContractCall = (messages: string, classificationResult: string, tokenData: string) =>
  generateObject({
    model: gpt4Model.asObjectGenerationModel(jsonObjectPrompt.text()),

    schema: zodSchema(
      z.object({
        contracts: z.array(
          z.object({
            address: z.string().describe("The contract address"),
            abi: z.string().describe("The contract abi"),
            functionName: z.string().describe("The function name, probably e.g. `transfer` for erc20 token transfer"),
            args: z.array(z.string()).describe("The function arguments, the required input parameters for the function"),
          })
        ),
      })
    ),

    prompt:
      `Based on this conversation ### ${messages} ### classified as ### ${classificationResult} ### and this token data ### ${tokenData} ###, formulate the transaction object for the coinbase sdk. Choose the most relevant token from the token list based on market capital.`
});

const extractTokenData = (messages: string, classificationResult: string) =>
  generateObject({
    model: gpt4Model.asObjectGenerationModel(jsonObjectPrompt.text()),

    schema: zodSchema(
      z.object({
        tokenData: z.array(
          z.object({
            tokenName: z.string().describe("The erc20 token name the user wants to transfer"),
            tokenSymbol: z.string().describe("the erc20 token symbol the user wants to transfer"),
          })
        ),
      })
    ),

    prompt:
      `Based on this conversation ### ${messages} ### classified as ### ${classificationResult} ### find all relevant token data the user has provided.`
});

const tokenList = async (token_symbol: string, token_name: string) => {
  console.log("RUNNING TOKEN LOOKUP", token_symbol);
  const response = await fetch(
    `https://eth.blockscout.com/api/v2/tokens?q=${token_symbol}%20${token_name}&type=ERC-20`,
    {
      headers: {
        'accept': 'application/json'
      }
    }
  );
  const data = await response.json();
  return data;
};
