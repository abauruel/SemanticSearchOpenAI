import 'dotenv/config'
import { ChatOpenAI } from "langchain/chat_models/openai";
import { RetrievalQAChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

const azureOpenAiParams = {
  azureOpenAIApiKey: process.env.AZUREOPENAPI_API_KEY,
  azureOpenAIApiInstanceName: process.env.AZUREOPENAPI_INSTANCE_NAME,
  azureOpenAIApiDeploymentName: process.env.AZUREOPEAPI_DEPLOYMENT_NAME_EMBEDDING,
  azureOpenAIApiVersion: process.env.AZUREOPEAPI_API_VERSION_EMBEDDING,
}

const vectorStore = await HNSWLib.load("src/data/movies_embedding", new OpenAIEmbeddings({
  ...azureOpenAiParams
}))

const openAiChat = new ChatOpenAI({
  ...azureOpenAiParams,
  azureOpenAIApiDeploymentName: process.env.AZUREOPEAPI_DEPLOYMENT_NAME_CHAT,
  azureOpenAIApiVersion: process.env.AZUREOPEAPI_API_VERSION_CHAT,
  modelName: 'gpt-3.5-turbo',
  temperature: 0
})


const prompt = new PromptTemplate({
  template: `
  Voce responde perguntas sobre filmes
  Use o conteudo abaixo no Repositorio para responder a pergunta do usuario.
  
  Se a resposta não for encontrada no Repositorio, responda que não foi possivel encontrar opções para o que foi solicitado.
  Responda de forma descontraída e não invente a resposta.

  Repositorio:
  {context}

  Pergunta:
  {question}
  `.trim(),
  inputVariables: ['context', 'question']
})



const chain = RetrievalQAChain.fromLLM(openAiChat, vectorStore.asRetriever(), {
  prompt,
  returnSourceDocuments: true,
  verbose: false
})

async function main() {
  const response = await chain.call({
    query: 'Gostaria de uma recomendação de filmes de comedia para assistir'
  })

  console.log(response)
}

main()