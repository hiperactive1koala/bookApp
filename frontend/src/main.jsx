import './index.css'
import App from "./App.jsx";
import ReactDOM from "react-dom/client";

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router} from 'react-router-dom';

import { setContext } from '@apollo/client/link/context';
import { createHttpLink } from '@apollo/client/link/http';

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/'
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('book-app-user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null
    }
  }
})

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink)
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </Router>
);
