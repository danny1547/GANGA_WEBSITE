const graphql = require("graphql");
const { PrismaClient } = require("@prisma/client");

const { GraphQLDateTime } = require("graphql-iso-date");
const prisma = new PrismaClient();

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLScalarType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
} = graphql;

const StatusEnumType = new GraphQLEnumType({
  name: "StatusEnum",
  values: {
    AVAILABLE: { value: "AVAILABLE" },
    ISSUED: { value: "ISSUED" },
  },
});
const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    language: { type: GraphQLString },
    year: { type: GraphQLString },
    publisher: { type: GraphQLString },
    isbn: { type: GraphQLString },
    bookid: { type: GraphQLString },
    status: { type: StatusEnumType },
    authorid: { type: GraphQLInt },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        return prisma.author.findOne({
          where: { id: parent.authorid },
        });
      },
    },
  }),
});

const RegisterType = new GraphQLObjectType({
  name: "Register",
  fields: () => ({
    id: { type: GraphQLInt },
    student_name: { type: GraphQLString },
    roll_number: { type: GraphQLString },
    bookID: { type: GraphQLString },
    return_status: { type: GraphQLBoolean },
    issued_date: { type: GraphQLString },
    returned_date: { type: GraphQLString },
    book: {
      type: BookType,
      resolve(parent, args) {
        return prisma.book.findOne({
          where: { bookid: parent.bookID },
        });
      },
    },
  }),
});
const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    lastname: { type: GraphQLString },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return prisma.book.findMany({
          where: { authorid: parent.id },
        });
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: () => ({
    book: {
      type: BookType,
      args: { id: { type: GraphQLInt } },

      resolve(parent, args) {
        return prisma.book.findOne({
          where: { id: args.id },
        });
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLInt } },

      resolve(parent, args) {
        return prisma.author.findOne({
          where: { id: args.id },
        });
      },
    },
    registerEntry: {
      type: RegisterType,
      args: { id: { type: GraphQLInt } },

      resolve(parent, args) {
        return prisma.register.findOne({
          where: { id: args.id },
        });
      },
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return prisma.book.findMany({});
      },
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        return prisma.author.findMany({});
      },
    },

    registerEntries: {
      type: new GraphQLList(RegisterType),
      resolve(parent, args) {
        return prisma.register.findMany({});
      },
    },
  }),
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        lastname: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        return prisma.author.create({
          data: {
            name: args.name,
            lastname: args.lastname,
          },
        });
      },
    },

    addBook: {
      type: BookType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        language: { type: new GraphQLNonNull(GraphQLString) },
        year: { type: new GraphQLNonNull(GraphQLString) },
        publisher: { type: new GraphQLNonNull(GraphQLString) },
        isbn: { type: new GraphQLNonNull(GraphQLString) },
        bookid: { type: new GraphQLNonNull(GraphQLString) },
        authorid: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parent, args) {
        return prisma.book.create({
          data: {
            name: args.name,
            genre: args.genre,
            language: args.language,
            year: args.year,
            publisher: args.publisher,
            isbn: args.isbn,
            bookid: args.bookid,
            author: { connect: { id: args.authorid } },
            status: "AVAILABLE",
          },
        });
      },
    },
    addExit: {
      type: RegisterType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parent, args) {
        async function exit() {
          const updatedEntry = await prisma.register.update({
            where: { id: args.id },
            data: { return_status: true },
          });
          await prisma.book.update({
            where: { bookid: updatedEntry.bookID },
            data: { status: "AVAILABLE" },
          });
          return prisma.register.findOne({
            where: { id: args.id },
          });
        }

        return exit();
      },
    },

    addEntry: {
      type: RegisterType,
      args: {
        student_name: { type: new GraphQLNonNull(GraphQLString) },
        roll_number: { type: new GraphQLNonNull(GraphQLString) },
        bookID: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        async function entry() {
          await prisma.book.update({
            where: { bookid: args.bookID },
            data: { status: "ISSUED" },
          });
          const createdEntry = await prisma.register.create({
            data: {
              student_name: args.student_name,
              roll_number: args.roll_number,
              book: { connect: { bookid: args.bookID } },
            },
          });
          return prisma.register.findOne({
            where: { id: createdEntry.id },
          });
        }

        return entry();
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
