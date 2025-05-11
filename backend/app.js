const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const cors = require("cors");

const donorRouter = require("./routes/donorRoutes");
const hospitalRouter = require("./routes/hospitalRoutes");
const adminRouter = require("./routes/adminRoutes");

const globalErrorHandler = require("./utils/errorHandler");
const processTenRequests = require("./jobs/processTenRequests");

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use(helmet());

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

app.use(compression());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});

app.use(morgan("dev"));

app.use("/api/v1/donors", donorRouter);
app.use("/api/v1/hospitals", hospitalRouter);
app.use("/api/v1/admin", adminRouter);

app.use(globalErrorHandler);

module.exports = app;
