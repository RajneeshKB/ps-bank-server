const path = require("path");
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const fs = require("fs");

const schema = require("../graphql/schema");
const resolvers = require("../graphql/resolvers");
const auth = require("../middleware/auth");
const app = express();

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);
app.use(helmet());
app.use(morgan("combined", { stream: accessLogStream }));
app.use(cors());
app.use(auth);
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
    customFormatErrorFn(err) {
      if (!err.originalError) {
        return err;
      }
      const data = err.originalError.data;
      const message = err.message || "An error occured";
      const code = err.originalError.code || 500;
      return { message: message, status: code, data: data };
    },
    graphiql: true,
  })
);

const MANGO_DB_URI =
  "mongodb+srv://rajneesh:Ba5rbozw4kUhx6OG@cluster0.fr2arb9.mongodb.net/psbank?retryWrites=true&w=majority";
mongoose
  .connect(MANGO_DB_URI)
  .then((result) => {
    app.listen(process.env.PORT || 4000, () =>
      console.log(`Now browse to localhost:${process.env.PORT || 4000}/graphql`)
    );
  })
  .catch((err) => {
    console.log("connection error", err);
  });
