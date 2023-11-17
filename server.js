const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
dotenv.config({ path: "./config/config.env" });
const ConnectDB = require("./config/db.js");
const errorHandler = require("./middleware/error.js");
const app = new express();
const category = require("./routes/category.js");
const user = require("./routes/auth.js");
const cookieParser = require("cookie-parser");
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);

//Connting To DB
ConnectDB();

//Router Monut
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/", category);
app.use("/api/v1/user", user);
//Custom Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server Running at http://localhost: ${PORT}`);
});
