const express = require("express");
const graphqlHTTP = require("express-graphql");
const schema = require("./schema/schema");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const cors = require("cors");

const app = express();

app.use(cors());
// async function main() {
//   // ... you will write your Prisma Client queries here
//   //const allAuthors = await prisma.author.findMany({});
//   //console.log();
//   // const deletedUser = await prisma.book.delete({
//   //   where: { id: 61 },
//   // });
//   // const count = await prisma.book.count();
//   // console.log(count);
// }
// main()
//   .catch((e) => {
//     throw e;
//   })
//   .finally(async () => {
//     await prisma.disconnect();
//   });

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.listen(4000, () => {
  console.log("Now, listening to port 4000");
});
