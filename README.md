# Mai Tai Wallet

> _Next.js app_, _OpenAI GPT-3.5-turbo_, _streaming_, _stream forwarding (keep API key on server)_

Inteligent intent execution with interactive chat interface.

## Introduction
This project is a web application that combines natural language processing with blockchain interactions, built using Next.js and Material-UI. It allows users to interact with smart contracts through a conversational interface.

## Key Features
**Interactive Chat Interface:**
Users can communicate with an AI assistant through a clean, modern chat interface

**Smart Contract Integration:** Automatically processes user requests to interact with blockchain 

**Multi-Chain Support:** Built-in support for multiple blockchain networks. Cross-chain functionality is on the roadmap.

## Technical Stack
**Frontend:** Next.js with TypeScript

**UI Framework:** Material-UI (MUI)

**Blockchain Integration:** Smart Wallet from Base is used to interact with the blockchain. Wagmi and viem are used under the hood.

**AI Integration:** App supports APIs for message classification and response streaming, powered by ModelFusion library.


## Usage

1. Create `.env.local` file with the following content:

```sh
OPENAI_API_KEY="YOUR_OPENAI_API_KEY"
NEXT_PUBLIC_CDP_API_KEY="YOUR_CDP_API_KEY"
NEXT_PUBLIC_WC_PROJECT_ID="YOUR_WAGMI_PROJECT_ID"
```

2. Run the following commands to get started

```sh
yarn
yarn dev 
```

3. Go to http://localhost:3000/ in your browser
