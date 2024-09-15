/* eslint-disable react/prop-types */

import { useMutation } from "@apollo/client"
import { ALL_AUTHORS, UPDATE_AUTHOR } from "../queries"
import { useState } from "react"
import Select from 'react-select';

const BirthYear = ({ allAuthors }) => {
    const names = allAuthors.map(author => (
        {value: author.name, label: author.name}
    ))
    
    const [name, setName] = useState(names[0])    
    const [bornYear, setBornYear] = useState('')

    const [ editAuthor ] = useMutation(UPDATE_AUTHOR, {
        refetchQueries: { query: ALL_AUTHORS}
    })

    const submit = (event) => {
        event.preventDefault()
        editAuthor({ variables: { name: name.value, setToBorn: Number(bornYear) }})
        
        setName(names[0])
        setBornYear('')
    }
  return (
    <div>
        <h2>Set birthyear</h2>
        <form onSubmit={submit}>
            <Select
                defaultValue={name}
                onChange={setName}
                options={names}
            />
            <div>born <input 
                type="text"
                value={bornYear}
                onChange={({ target }) => setBornYear(target.value)}
            /></div>
            <button type="submit">update author</button>
        </form>
    </div>
  )
}

export default BirthYear