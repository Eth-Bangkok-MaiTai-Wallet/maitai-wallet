import { clusters } from "@/lib/classification";
import {
  cohere,
  createEventSourceStream,
  generateObject,
  llamacpp,
  openai,
  streamText,
  trimChatPrompt,
  jsonObjectPrompt,
  zodSchema,
  EmbeddingSimilarityClassifier,
  classify,
} from "modelfusion";
import { z } from "zod";


export const config = { runtime: "edge" };

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
});

const requestSchema = z.array(messageSchema);

const gpt4Model = openai.ChatTextGenerator({
  // explicit API configuration needed for NextJS environment
  // (otherwise env variables are not available):
  api: openai.Api({
    apiKey: process.env.OPENAI_API_KEY,
  }),
  model: "gpt-4-1106-preview",
  maxGenerationTokens: 1000,
});

// example assumes you are running https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF with llama.cpp
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const llama2Model = llamacpp.CompletionTextGenerator({
  promptTemplate: llamacpp.prompt.Llama2,
  contextWindowSize: 4096, // Llama 2 context window size
  maxGenerationTokens: 512,
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const cohereModel = cohere.TextGenerator({
  // explicit API configuration needed for NextJS environment
  // (otherwise env variables are not available):
  // api: cohere.Api({
  //   apiKey: process.env.COHERE_API_KEY,
  // }),
  model: "command",
  maxGenerationTokens: 512,
});

const sendMessage = async (request: Request): Promise<Response> => {
  if (request.method !== "POST") {
    return new Response(
      JSON.stringify({
        error: `Method ${request.method} not allowed. Only POST allowed.`,
      }),
      { status: 405, headers: { "Content-Type": "application/json" } }
    );
  }

  const parsedData = requestSchema.safeParse(await request.json());

  console.log("parsedData", parsedData)

  if (parsedData.success === false) {
    return new Response(
      JSON.stringify({
        error: `Could not parse content. Error: ${parsedData.error}`,
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // forward the abort signal
  const controller = new AbortController();
  request.signal.addEventListener("abort", () => controller.abort());

  const messages = parsedData.data;

  // change this to your preferred model:
  const chatModel = gpt4Model.withChatPrompt();

  // const listUserOp = (messages: string) =>
  //   generateObject({
  //     model: gpt4Model.asObjectGenerationModel(jsonObjectPrompt.text()),
  
  //     schema: zodSchema(
  //       z.object({
  //         contracts: z.array(
  //           z.object({
  //             address: z.string(),
  //             abi: z.string(),
  //             functionName: z.string(),
  //             args: z.array(z.string()),
  //           })
  //         ),
  //       })
  //     ),
  
  //     prompt:
  //       `Based on this conversation formulate the userOp object for the coinbase sdk: ${messages}`
  //   });

  const textStream = await streamText({
    model: chatModel,
    // limit the size of the prompt to leave room for the answer:
    prompt: await trimChatPrompt({
      model: chatModel,
      prompt: {
        system:
          "You are receiving a user request and a JSON object containing transaction data. Formulate the transaction data into a user friendly sentence. E.g. Ready to transfer 1000 USDC to address 0x1234567890123456789012345678901234567890. Awaiting confirmation..." + 
          "Underneath that sentence, make a list of the transaction data in the JSON object.",
        messages,
      },
    }),

    // forward the abort signal:
    run: { abortSignal: controller.signal },
  });

  return new Response(createEventSourceStream(textStream), {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Content-Encoding": "none",
    },
  });
};

export default sendMessage;
