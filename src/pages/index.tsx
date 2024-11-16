import { ChatInputArea } from "@/component/ChatInputArea";
import { ChatMessageInput } from "@/component/ChatMessageInput";
import { ChatMessageView } from "@/component/ChatMessageView";
import { Box, Button } from "@mui/material";
import { zodSchema } from "modelfusion";
import { readEventSourceStream } from "modelfusion-experimental/browser";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";

type Message = { role: "user" | "assistant"; content: string };

export default function Home() {
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [isSending, setIsSending] = useState<boolean>(false);

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

      const response2 = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messagesToSend),
        // signal: abortController.current.signal,
      });

      const outputClassification = response2.body

      const outputClassificationJSON = await extractJSONFromStream(outputClassification)

      console.log("outputClassificationJSON", outputClassificationJSON)

      console.log("outputClassificationJSON.content", outputClassificationJSON.content)

      messagesToSend[0].content =  messagesToSend[0].content + outputClassificationJSON.content


      // const msg2: Message = { role: "user", content: outputClassificationJSON }

      // const messagesToSend2 = [...messagesToSend, msg2]

      console.log("Messages to send 2: ", messagesToSend)

      const response = await fetch("/api/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messagesToSend),
        signal: abortController.current.signal,
      });

      console.log("AI Response: ", response)


      // const response2 = fetch("/api/classify", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(messagesToSend),
      //   // signal: abortController.current.signal,
      // });

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
        component="main"
        sx={{
          position: "relative",
          flexGrow: 1,
          height: "100%",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "relative",
            maxHeight: "100%",
            overflowY: "auto",
          }}
        >
          <Box sx={{ height: "100%", overflowY: "auto", marginTop: 2 }}>
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
    </>
  );
}


