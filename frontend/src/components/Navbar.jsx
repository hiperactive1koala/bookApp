/* eslint-disable react/prop-types */
import { Link } from "react-router-dom"
import Logout from "./Logout"

const Navbar = ({ token, setToken }) => {
  return (
    <nav>
        <Link to='/'>authors</Link>
        <Link to='/books'>books</Link>
        {token && <>
          <Link to='/add-book'>add book</Link>
          <Logout setToken={setToken} />
        </>}
        {!token && <Link to='/login'>login</Link>}
    </nav>
  )
}

export default Navbar