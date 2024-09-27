/* eslint-disable react/prop-types */
import { useApolloClient } from '@apollo/client'

const Logout = ({ setToken }) => {
  const client = useApolloClient()

    const logout = () => {
        setToken(null)
        localStorage.removeItem('book-app-user-token')
        client.resetStore()
    }

  return (<button onClick={logout}>logout</button>)
}

export default Logout