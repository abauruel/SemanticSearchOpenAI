import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import { HNSWLib } from "langchain/vectorstores/hnswlib"
import { NextResponse } from "next/server"
import movies from "../../data/movies.json"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const q = searchParams.get("q")

  if (!q) {
    return new NextResponse(JSON.stringify({ message: "Missing query" }), {
      status: 400,
    })
  }

  const vectorStore = await HNSWLib.load("src/data/movies_embedding", new OpenAIEmbeddings({
    azureOpenAIApiKey: process.env.AZUREOPENAPI_API_KEY,
    azureOpenAIApiInstanceName: process.env.AZUREOPENAPI_INSTANCE_NAME,
    azureOpenAIApiDeploymentName: process.env.AZUREOPEAPI_DEPLOYMENT_NAME_EMBEDDING,
    azureOpenAIApiVersion: process.env.AZUREOPEAPI_API_VERSION_EMBEDDING,
  }))

  const searchResult = await vectorStore.similaritySearch(q, 2)

  const searchResultIds = searchResult.map((r) => r.metadata.id)

  let results = movies.movies.filter((movie) => searchResultIds.includes(movie.id))
  console.log(results.map(movie => movie.movie_name))
  return NextResponse.json({ results })
}