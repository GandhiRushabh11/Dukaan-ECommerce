const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const ConnectDB = require("./config/db.js");
const errorHandler = require("./middleware/error.js");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const hpp = require("hpp");

//Load env vars
dotenv.config({ path: "./config/config.env" });

//Connting To DB
ConnectDB();

//Route files
const category = require("./routes/category.js");
const user = require("./routes/auth.js");
const product = require("./routes/product.js");
const cart = require("./routes/cart.js");
const review = require("./routes/review.js");
const order = require("./routes/order.js");
const app = new express();

//Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Sanitize data
app.use(mongoSanitize());

//Set Securtiy headers
app.use(helmet());

//Prevent Xss attacks(Cross side scripting Text)
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

app.use(cookieParser());

//Router Monut
app.use("/api/v1/category", category);
app.use("/api/v1/user", user);
app.use("/api/v1/product", product);
app.use("/api/v1/cart", cart);
app.use("/api/v1/reviews", review);
app.use("/api/v1/order", order);

//Custom Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server Running at http://localhost: ${PORT}`);
});
