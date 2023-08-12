import 'dotenv/config'
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { JSONLoader } from "langchain/document_loaders/fs/json";
import { TokenTextSplitter } from "langchain/text_splitter";


const azureOpenAiParams = {
  azureOpenAIApiKey: process.env.AZUREOPENAPI_API_KEY,
  azureOpenAIApiInstanceName: process.env.AZUREOPENAPI_INSTANCE_NAME,
  azureOpenAIApiDeploymentName: process.env.AZUREOPEAPI_DEPLOYMENT_NAME_EMBEDDING,
  azureOpenAIApiVersion: process.env.AZUREOPEAPI_API_VERSION_EMBEDDING,
}

const generateEmbedding = async () => {
  try {
    const start = performance.now() / 1000

    const loader = new JSONLoader('src/data/movies.json', '/movie_name')
    const docs = await loader.load()
    const splitter = new TokenTextSplitter({
      encodingName: 'cl100k_base',
      chunkSize: 600,
      chunkOverlap: 0
    })
    const splittedDocuments = await splitter.splitDocuments(docs)


    const vectorStore = await HNSWLib.fromDocuments(splittedDocuments, new OpenAIEmbeddings({
      ...azureOpenAiParams
    }))
    await vectorStore.save("src/data/movies_embedding")

    const end = performance.now() / 1000

    console.log(`Took ${(end - start).toFixed(2)}s`)

  } catch (error) {
    console.log(error)
  }
}

generateEmbedding()