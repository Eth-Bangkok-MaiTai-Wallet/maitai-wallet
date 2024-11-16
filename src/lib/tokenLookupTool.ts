import { Tool, zodSchema } from "modelfusion";
import { z } from "zod";

export const tokenLookup = new Tool({
  name: "tokenLookup",
  description: "Find erc-20 token data based on name or symbol",

  // The input schema describes the parameters that the tool expects.
  // You can use any ModelFusion schema (here: ZodSchema).
  parameters: zodSchema(
    z.object({
      token_name: z.string().describe("The name of the token"),
      token_symbol: z.number().describe("The token symbol"),
    })
  ),

  // The execute function is called with the parameters.
  execute: async ({ token_name, token_symbol }) => {
    const response = await fetch(
      `https://eth.blockscout.com/api/v2/tokens?q=${encodeURIComponent(token_name + ' ' + token_symbol)}&type=ERC-20`,
      {
        headers: {
          'accept': 'application/json'
        }
      }
    );
    const data = await response.json();
    return data;
  },
});
