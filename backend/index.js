const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { v1:uuid } = require('uuid')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')

const mongoose = require('mongoose')
require('dotenv').config()
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

mongoose.set('strictQuery', false)

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })


// let authors = [
//   {
//     name: 'Robert Martin',
//     id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
//     born: 1952,
//   },
//   {
//     name: 'Martin Fowler',
//     id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
//     born: 1963
//   },
//   {
//     name: 'Fyodor Dostoevsky',
//     id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
//     born: 1821
//   },
//   { 
//     name: 'Joshua Kerievsky', // birthyear not known
//     id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
//   },
//   { 
//     name: 'Sandi Metz', // birthyear not known
//     id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
//   },
// ]

// let books = [
//   {
//     title: 'Clean Code',
//     published: 2008,
//     author: 'Robert Martin',
//     id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring']
//   },
//   {
//     title: 'Agile software development',
//     published: 2002,
//     author: 'Robert Martin',
//     id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
//     genres: ['agile', 'patterns', 'design']
//   },
//   {
//     title: 'Refactoring, edition 2',
//     published: 2018,
//     author: 'Martin Fowler',
//     id: "afa5de00-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring']
//   },
//   {
//     title: 'Refactoring to patterns',
//     published: 2008,
//     author: 'Joshua Kerievsky',
//     id: "afa5de01-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring', 'patterns']
//   },  
//   {
//     title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
//     published: 2012,
//     author: 'Sandi Metz',
//     id: "afa5de02-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring', 'design']
//   },
//   {
//     title: 'Crime and punishment',
//     published: 1866,
//     author: 'Fyodor Dostoevsky',
//     id: "afa5de03-344d-11e9-a414-719c6709cf3e",
//     genres: ['classic', 'crime']
//   },
//   {
//     title: 'Demons',
//     published: 1872,
//     author: 'Fyodor Dostoevsky',
//     id: "afa5de04-344d-11e9-a414-719c6709cf3e",
//     genres: ['classic', 'revolution']
//   },
// ]

const typeDefs = `
  type Books {
    title: String!
    author: Author!
    published: Int!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    born: Int
    bookCount: Int!
    id: ID!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }
  
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Books!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Books
    editAuthor(
      name: String!
      setToBorn: Int!
    ): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
  `

const resolvers = {
  Query: {
    bookCount: async () => await Book.collection.countDocuments({}),
    authorCount: async () => await Author.collection.countDocuments({}),
    allBooks: async (root, args) => {
      let books = await Book.find({}).populate('author')
      let response = books.map(book => (
        {
          ...book._doc,
          id: book.id,
          bookCount: books.length,
          author: {
            ...book.author._doc,
            id: book.author.id,
            bookCount: books.filter(b => b.author.id.toString() === book.author.id.toString()).length || 0
          }
        }
      ))

      if(args.author) { response = response.filter(res => res.author.name === args.author)}
      if(args.genre) { response = response.filter(res => res.genres.includes(args.genre))}

      return response
    },
    allAuthors: async () => {
      const authors = await Author.find({})
      return authors.map(async author => ({
        name: author.name,
        born: author.born,
        id: author.id,
        bookCount: await Book.countDocuments({author: author.id})
      }))
    },
    me: (root, args, context) => context.currentUser
  },
  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      if(!currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }
      if(args.title.length < 2) {
        throw new GraphQLError('Title is too short', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
          },
        })
      }
      if(args.author.length < 2) {
        throw new GraphQLError('Author name is too short', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.author,
          },
        })
      }

      const author = await Author.findOne({name: args.author})
      if(author){
        const newBook = new Book({ ...args, author: author, bookCount: await Book.collection.countDocuments({author: args.author}) })
        await newBook.save()
        return {
          id: newBook.id,
          title: newBook.title,
          published: newBook.published,
          genres: newBook.genres,
          author: {
            id: author.id,
            name: author.name,
            born: author.born || null,
            bookCount: await Book.countDocuments({ author: author.id })
          }
        }
      }
      else{
        const newAuthor = new Author({ name: args.author })
        await newAuthor.save()

        const newBook = new Book({
          title: args.title,
          published: args.published,
          genres: args.genres,
          author: newAuthor
        })
        await newBook.save()
        return {
          id: newBook.id,
          title: newBook.title,
          published: newBook.published,
          genres: newBook.genres,
          author: {
          id: newAuthor.id,
          name: newAuthor.name,
          born: newAuthor.born || null,
          bookCount: await Book.countDocuments({ author: newAuthor.id })
        }}
      }
    },
    editAuthor: async (root, args, { currentUser }) => {
      if(!currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }
      const author = await Author.findOne({name: args.name})
      if (!author) return null
      
      author.born = args.setToBorn
      await author.save()
      return {
        id: author.id,
        name: author.name,
        born: author.born,
        bookCount: await Book.countDocuments({author: author.id})
      }
    },
    createUser: async (root, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
      return user.save()
      .catch(error => {
        throw new GraphQLError('Creating the user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error
          }
        })
      })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if ( !user || args.password !== 'secret' ) {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const userForToken = {
        username: user.username,
        id: user.id
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if(auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})