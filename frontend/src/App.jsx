import { Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";

import Navbar from "./components/Navbar";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";

const App = () => {

  const [token, setToken] = useState(null)
  useEffect(() => {
    const token = localStorage.getItem('book-app-user-token')
    setToken(token)
  }, [])

  return (
    <div>
      <Navbar token={token} setToken={setToken} />
      <Routes>
        <Route path="/" element={ <Authors />}></Route>
        <Route path="/books" element={ <Books />}></Route>
        {!token &&
          <Route path="/login" element={ <LoginForm setToken={setToken} />}></Route>
        }
        {token &&
          <Route path="/add-book" element={ <NewBook />}></Route>
        }
      </Routes>
    </div>
  );
};

export default App;
