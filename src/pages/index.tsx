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
import {SEPOLIA_CHAIN_ID, storageContractAddress, storageTestABI, POLYGON_CHAIN_ID} from "@/constants"

type Message = { role: "user" | "assistant"; content: string };

export default function Home() {
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [isSending, setIsSending] = useState<boolean>(false);

  const abortController = useRef<AbortController | null>(null);

  const handleSend = async (message: string) => {
    try {
      const userMessage: Message = { role: "user", content: message };
      const messagesToSend = [...messages, userMessage];

      setIsSending(true);
      setMessages([...messagesToSend, { role: "assistant", content: "..." }]);

      abortController.current = new AbortController();

      const response = await fetch("/api/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messagesToSend),
        signal: abortController.current.signal,
      });

      console.log("AI Response: ", response)

      const response2 = fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messagesToSend),
        // signal: abortController.current.signal,
      });

      console.log("Classification Response: ", response2)

      const textDeltas = readEventSourceStream({
        stream: response.body!,
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
            chainId={SEPOLIA_CHAIN_ID} 
            address={storageContractAddress} 
            abi={storageTestABI} 
            functionName='store' 
            args={[7]} 
          />
        </Box>
      </Box>
    </>
  );
}
