import { ChatInputArea } from "@/component/ChatInputArea";
import { ChatMessageInput } from "@/component/ChatMessageInput";
import { ChatMessageView } from "@/component/ChatMessageView";
import { Box, Button } from "@mui/material";
import { zodSchema } from "modelfusion";
import { readEventSourceStream } from "modelfusion-experimental/browser";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import TransactionWrapper from "@/component/TransactionWrapper"
import {BASE_SEPOLIA_CHAIN_ID, SEPOLIA_CHAIN_ID, storageContractAddress, storageTestABI, POLYGON_CHAIN_ID, BASE_CHAIN_ID} from "@/constants"
import { Hex } from "viem";

type Message = { role: "user" | "assistant"; content: string };

export default function Home() {
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isTransactionDisabled, setIsTransactionDisabled] = useState(true);
  const [transactionObject, setTransactionObject] = useState({
    "address" : "" as Hex,
    "abi" : [] as any,
    "functionName" : "",
    "args": []
  } );

  const abortController = useRef<AbortController | null>(null);

  async function extractJSONFromStream(stream: any) {
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let result = "";
  
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      result += decoder.decode(value, { stream: true });
    }
  
    // Parse the JSON string
    return JSON.parse(result);
  }

  const handleSend = async (message: string) => {
    try {
      const userMessage: Message = { role: "user", content: message };
      const messagesToSend = [...messages, userMessage];

      setIsSending(true);
      setMessages([...messagesToSend, { role: "assistant", content: "..." }]);

      abortController.current = new AbortController();

      let streamInput;

      const response = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messagesToSend),
        // signal: abortController.current.signal,
      });

      const outputClassification = response.body

      const outputClassificationJSON = await extractJSONFromStream(outputClassification)
      console.log("outputClassificationJSON", outputClassificationJSON)
      
      if(outputClassificationJSON.contracts){
        setTransactionObject(outputClassificationJSON.contracts)
        setIsTransactionDisabled(false);

        console.log("outputClassificationJSON.content", outputClassificationJSON.contracts)

<<<<<<< HEAD
        messagesToSend[0].content =  messagesToSend[0].content + JSON.stringify(outputClassificationJSON.contracts)
=======
        messagesToSend[0].content =  messagesToSend[0].content + " here is the complete transaction: " + outputClassificationJSON.contracts
>>>>>>> main

        const response2 = await fetch("/api/send-message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(messagesToSend),
          signal: abortController.current.signal,
        });

        console.log("Messages to send 2: ", messagesToSend)
        console.log("AI Response: ", response2)

        streamInput = response2.body;
      } else {
        streamInput = new ReadableStream({
          start(controller) {
            controller.enqueue('Please provide more context!');
            controller.close();
          }
        });
      }

      const textDeltas = readEventSourceStream({
        stream: streamInput!,
        schema: zodSchema(z.string()),
      });

      let accumulatedContent = "";
      for await (const textDelta of textDeltas) {
        accumulatedContent += textDelta;

        setMessages((currentMessages) => [
          ...currentMessages.slice(0, currentMessages.length - 1),
          { role: "assistant", content: accumulatedContent },
        ]);
      }
    } finally {
      setIsSending(false);
      abortController.current = null;
    }
  };

  const handleStopGenerate = () => {
    if (abortController.current) {
      abortController.current.abort();
      setIsSending(false);
      abortController.current = null;
    }
  };

  // Add cleanup effect to abort on unmount.
  useEffect(() => {
    return () => {
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, []);

  return (
    <>
      <Head>
        <title>ModelFusion chat example</title>
      </Head>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '100vh',
          padding: '2rem',
        }}
      >
        <Box
          component="main"
          sx={{
            position: "relative",
            width: '100%',
            maxWidth: '800px', // Limit maximum width
            height: '70vh',    // Take 70% of viewport height
            display: 'flex',
            flexDirection: 'column',
            // backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "relative",
              maxHeight: "100%",
              overflowY: "auto",
              padding: '1rem',
            }}
          >
            <Box sx={{ height: "100%", overflowY: "auto" }}>
              {messages.map((message, index) => (
                <ChatMessageView
                  key={index}
                  message={{ role: message.role, content: message.content }}
                />
              ))}
              <Box sx={{ height: "160px" }} />
            </Box>
          </Box>

          {isSending ? (
            <ChatInputArea>
              <Button
                variant="outlined"
                sx={{ width: "100%" }}
                onClick={handleStopGenerate}
              >
                Stop Generating
              </Button>
            </ChatInputArea>
          ) : (
            <ChatMessageInput onSend={handleSend} />
          )}
        </Box>

        {/* Transaction Wrapper with styled button */}
        <Box sx={{ 
          mt: 3, 
          width: '100%', 
          maxWidth: '800px',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <TransactionWrapper
            onStatus={()=> {}} 
            chainId={BASE_CHAIN_ID} 
            address={transactionObject.address} 
            abi={transactionObject.abi} 
            functionName={transactionObject.functionName} 
            args={transactionObject.args}
            disabled={isTransactionDisabled}
          />
        </Box>
      </Box>
    </>
  );
}


