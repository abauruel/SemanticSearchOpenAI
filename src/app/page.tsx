"use client"
import { useState } from "react"
import { useAsyncFn } from "react-use"

interface SearchResults {
  results: {
    id: string
    name: string
    year: number
    actors: string[]
    storyline: string
  }[]
}

export default function Home() {
  const [query, setQuery] = useState("")

  const [{ value, loading }, search] = useAsyncFn<() => Promise<SearchResults>>(
    async () => {
      const response = await fetch("/api?q=" + query);
      const data = await response.json();
      console.log(data)
      return data;
    },
    [query]
  )

  return (
    <main className="flex min-h-screen flex-col items-center p-5 lg:p-24 w-full mx-auto">
      <h1 className="text-4xl font-bold text-center">Search Movies</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          search()
        }}
      >
        <input
          type="text"
          name="search"
          className="border-2 border-gray-300 bg-black mt-3 h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
          placeholder="Search anything"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>

      <div className="mt-10">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="flex flex-wrap gap-5">
            {value?.results.map((movie) => (
              <div
                key={movie.id}
                className="flex flex-col bg-gray-800 rounded-lg shadow-lg p-5 w-full max-w-sm"
              >
                <h2 className="text-xl font-bold">{movie.name}</h2>
                <p className="text-sm">{movie.year}</p>
                <p className="text-sm">{movie.actors.join(", ")}</p>
                <p className="text-sm">{movie.storyline}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}