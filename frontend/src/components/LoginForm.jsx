/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'
import { useNavigate } from "react-router-dom"

const LoginForm = ({ setToken }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const [login, result] = useMutation(LOGIN, {
        onError: (error) => {
            console.log(error.graphQLErrors[0].message)
        }
    })

    useEffect(() => {
        if(result.data) {
            const token = result.data.login.value
            setToken(token)
            localStorage.setItem('book-app-user-token', token)
            navigate('/')
        }
    }, [result.data])

    const submit = async (event) => {
        event.preventDefault()
        login({ variables: { username, password }})
        setUsername('')
        setPassword('')
    }

    return (
        <div>
            <form onSubmit={submit}>
                <div>
                    username <input value={username} onChange={({ target }) => setUsername(target.value)} />
                </div>
                <div>
                    password <input type="password" value={password} onChange={({ target }) => setPassword(target.value)} />
                </div>
                <button type="submit">login</button>
            </form>
        </div>
    )
}   

export default LoginForm