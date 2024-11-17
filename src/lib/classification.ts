export const clusters = [
    {
      name: "balance_inquiry" as const,
      values: [
        "What is my balance?",
        "How much eth do I have?",
        "What is my DAI balance?",
        "Tell me my balanc of WETH on mainnet",
      ],
    },
    {
      name: "eth_transfer_to_address" as const,
      values: [
        "send 0.1 eth to 0x119Ea671030FBf79AB93b436D2E20af6ea469a19",
        "send 5 ether to 0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
        "transfer 10000 wei to 0x742d35Cc2224C0532925a3b844Bc454e4438f44e",
        "send 200 gwei to 0x445Ea671030FBf79AB93b436D2E20af6ea469a19",
      ],
    },
    {
      name: "eth_transfer_to_ens" as const,
      values: [
        "send 0.1 eth to vitalik.eth",
        "send 5 ether to anything.eth",
        "send 10000 wei to hello.eth",
      ],
    },
    // {
    //   name: "eth_transfer_to_basename" as const,
    //   values: [
    //     "send 0.1 eth to vitalik.base.eth",
    //     "send 5 ether to anything.base.eth",
    //     "send 10000 wei to hello.base.eth",
    //     "send 0.1 eth to vitalik.basetest.eth",
    //     "send 5 ether to anything.basetest.eth",
    //     "send 10000 wei to hello.basetest.eth",
    //   ],
    // },
    {
      name: "erc20_transfer_to_address" as const,
      values: [
        "send 0.1 usdc to 0x119Ea671030FBf79AB93b436D2E20af6ea469a19",
        "transfer 5 wrapped ether to 0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
        "send 100 DAI to 0x742d35Cc2224C0532925a3b844Bc454e4438f44e",
        "transfer UNI to 0x445Ea671030FBf79AB93b436D2E20af6ea469a19",
      ],
    },
    {
      name: "erc20_transfer_to_ens" as const,
      values: [
        "send 0.1 usdc to vitalik.eth",
        "transfer 5 wrapped ether to satoshi.eth", 
        "send 100 DAI to uniswap.eth",
        "transfer UNI to compound.eth",
      ],
    },
    // {
    //     name: "erc20_transfer_to_basename" as const,
    //     values: [
    //       "send 0.1 usdc to vitalik.base.eth",
    //       "transfer 5 wrapped ether to satoshi.base.eth",
    //       "send 100 DAI to uniswap.basetest.eth", 
    //       "transfer UNI to compound.basetest.eth",
    //     ],
    //   },
    {
      name: "erc20_swap" as const,
      values: [
        "swap 100 USDC for ETH",
        "exchange 5 DAI for USDC",
        "trade 10 WETH for UNI",
        "convert 1000 USDT to DAI",
        "swap 50 UNI tokens for WETH",
        "exchange my LINK for USDC",
        "trade wrapped ether for DAI",
        "convert all my FRAX to ETH"
      ],
    },
    // {
    //   name: "erc721_transfer" as const,
    //   values: [
    //     "transfer NFT #1234 to 0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    //     "send BAYC #5678 to vitalik.eth",
    //     "transfer my NFT token id 9012 to satoshi.eth",
    //     "send cryptopunk #3456 to uniswap.base.eth",
    //     "transfer doodle #7890 to compound.basetest.eth",
    //     "send my NFT #2468 to 0x119Ea671030FBf79AB93b436D2E20af6ea469a19",
    //   ],
    // },
    // {
    //   name: "erc721_mint" as const,
    //   values: [
    //     "mint a new NFT",
    //     "mint NFT from collection BAYC",
    //     "mint me a new NFT on 0x119Ea671030FBf79AB93b436D2E20af6ea469a19",
    //     "I want to mint an NFT on collection 0x119Ea671030FBf79AB93b436D2E20af6ea469a19",
    //   ],
    // },
  ];