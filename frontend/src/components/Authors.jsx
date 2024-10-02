import { useQuery } from "@apollo/client"
import { ALL_AUTHORS } from "../queries"
import BirthYear from "./BirthYear"

const Authors = () => {
  const { loading, data } = useQuery(ALL_AUTHORS)
  if (loading) return null
  
  const authors = data.allAuthors
    
  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td style={{textAlign: 'right'}}>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <BirthYear allAuthors={authors} />
    </div>
  )
}

export default Authors
