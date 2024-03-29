import { OpenAIStream, StreamingTextResponse } from "ai";
import { Configuration, OpenAIApi } from "openai-edge";

import { NextRequest } from "next/server";

const openAIConfiguration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(openAIConfiguration);

export const runtime = "edge";

const systemPrompt =
  "너의 이름은 톰이고, 나의 AI Assistant야. 너의 역할은 정보보호 전문가야. 질문에 대해서 명확하게 답변해줘. 이건 매우 중요한거야.";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    stream: true,
    temperature: 0.7,
    max_tokens: 512,
    messages: [{ role: "system", content: systemPrompt }, ...messages],
  });

  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream);
}
