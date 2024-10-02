import { useQuery } from "@apollo/client"
import { ME } from "../queries"
import Table from "./Table"

const Recomended = () => {
    const { data, loading } = useQuery(ME)
    
    if (loading) return <div>loading...</div>
    return (
        <div>
            <h2>recommendations</h2>
            <p>books in your favorite genre <strong>{data.me.favoriteGenre}</strong></p>
            <Table genre={data.me.favoriteGenre} />
        </div>
    )
}

export default Recomended