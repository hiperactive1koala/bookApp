/* eslint-disable react/prop-types */
import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries";

const Table = ({ genre }) => {
    const { data, loading } = useQuery(ALL_BOOKS, {
        variables: { genre: genre },
        fetchPolicy: 'cache-and-network'
    });
    if (loading || !data) return <div>loading...</div>;
    return (
        <table>
            <tbody>
                <tr style={{ width: 320 }}>
                    <th style={{ width: 230, textAlign: 'left', border: '1px solid black' }}>title</th>
                    <th style={{ width: 120, textAlign: 'left', border: '1px solid black' }}>author</th>
                    <th style={{ width: 50, textAlign: 'left', border: '1px solid black' }}>published</th>
                </tr>
                {data.allBooks.map(book => (
                    <tr key={book.id}>
                        <td style={{ textAlign: 'left', border: '1px solid black' }}>{book.title}</td>
                        <td style={{ textAlign: 'left', border: '1px solid black' }}>{book.author.name}</td>
                        <td style={{ textAlign: 'right', border: '1px solid black' }}>{book.published}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default Table