import 'dotenv/config'
import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import { HNSWLib } from "langchain/vectorstores/hnswlib"

const search = async (text: string) => {
  try {
    const vectorStore = await HNSWLib.load("src/data/movies_embedding", new OpenAIEmbeddings({
      azureOpenAIApiKey: process.env.AZUREOPENAPI_API_KEY,
      azureOpenAIApiInstanceName: process.env.AZUREOPENAPI_INSTANCE_NAME,
      azureOpenAIApiDeploymentName: process.env.AZUREOPEAPI_DEPLOYMENT_NAME_EMBEDDING,
      azureOpenAIApiVersion: process.env.AZUREOPEAPI_API_VERSION_EMBEDDING,
    }))

    const results = await vectorStore.similaritySearch(text, 2) // returns only 2 entries

    results.forEach((r) => {
      console.log(r.pageContent.match(/Title:(.*)/)?.[0]) // Use regex to extract the title from the result text
    })
  } catch (error) {
    console.error(error)
  }
}

search("a Salma Hayek movie")