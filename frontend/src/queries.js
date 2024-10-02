import { gql } from "@apollo/client";

export const ALL_AUTHORS = gql`
    query {
        allAuthors {
            name
            born
            bookCount
            id
        }
    }
`
export const ALL_BOOKS = gql`
    query ($genre: String) {
        allBooks(genre: $genre) {
            title
            author {
                name,
                born,
                bookCount,
                id
            }
            published
            genres
            id
        }
    }
`

export const CREATE_BOOK = gql`
    mutation addBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
        addBook(
            title: $title,
            author: $author,
            published: $published,
            genres: $genres
        ) {
            title
            author {
                name
                born
                bookCount
                id
            }
            published
            genres
            id
        }
    }
`

export const UPDATE_AUTHOR = gql`
    mutation EditAuthor($name: String!, $setToBorn: Int!) {
        editAuthor(
            name: $name
            setToBorn: $setToBorn
        ) {
            name
            born
            bookCount
            id
        }
    }
`

export const LOGIN = gql`
    mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            value
        }
    }
`

export const ME = gql`
    query {
        me {
            username
            favoriteGenre
            id
        }
    }
`