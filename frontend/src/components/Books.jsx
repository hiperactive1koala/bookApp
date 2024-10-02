import { useQuery } from "@apollo/client"
import { ALL_BOOKS } from "../queries"
import { useState } from "react"
import { useEffect } from "react"
import Table from "./Table"

const Books = () => {
  const [filter, setFilter] = useState(null)
  const [genres, setGenres] = useState([])
  const { data: genresData } = useQuery(ALL_BOOKS, {
    options: {
      fetchPolicy: 'cache-and-network'
    }
  })

  useEffect(() => {
    if (genresData) {
      setGenres([...new Set(genresData.allBooks.map((book) => book.genres).flat())])
    }
  }, [genresData])
  
  return (
    <div>
      <h2>books</h2>
      <Table genre={filter} />
      <div>
        {genres.map((genre) => (
          <button key={genre} onClick={() => setFilter(genre)}>
            {genre}
          </button>
        ))}
        <button onClick={() => setFilter(null)}>all genres</button>
      </div>
    </div>
  )
}

export default Books
