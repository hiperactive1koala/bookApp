import { Link } from "react-router-dom"

const Navbar = () => {
  return (
    <nav>
        <Link to='/'>authors</Link>
        <Link to='/books'>books</Link>
        <Link to='/add-book'>add book</Link>
    </nav>
  )
}

export default Navbar