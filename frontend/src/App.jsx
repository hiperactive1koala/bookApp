import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";

const App = () => {

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={ <Authors />}></Route>
        <Route path="/books" element={ <Books />}></Route>
        <Route path="/add-book" element={ <NewBook />}></Route>
      </Routes>
    </div>
  );
};

export default App;
