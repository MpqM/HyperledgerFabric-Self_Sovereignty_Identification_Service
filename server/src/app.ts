import "dotenv/config";
import express from "express";
import morgan from "morgan";
import { errorHandler, notFoundHandler } from "./middlewares/error-handler";
import ssiRouter from "./routes/ssi";
import holderRouter from "./routes/holder";
import issuerRouter from "./routes/issuer";
import verifierRouter from "./routes/verifier";
import logger from "./utils/logger";
import env from "./utils/validate-env";
import MongoStore from "connect-mongo";
import session from "express-session";
import mongoose from "mongoose";
import bodyParser from "body-parser";
const app = express();
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    session({
      secret: env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 60 * 60 * 1000, },
      rolling: true,
      store: MongoStore.create({ mongoUrl: env.MONGO_CONNECTION_STRING,}),
    })
);
app.use(express.json());
const stream = { write: (message: string) => { logger.info(message.trim()); }, };
app.use(morgan(":method :status :url :response-time ms", { stream: stream }));

app.use("/ssi", ssiRouter);
app.use("/issuer", issuerRouter);
app.use("/holder", holderRouter);
app.use("/verifier", verifierRouter);

app.use(notFoundHandler);
app.use(errorHandler);

mongoose.connect(env.MONGO_CONNECTION_STRING)
    .then(() => {
        logger.info("Mongoose connected");
        app.listen(env.PORT, () => { logger.info(`server running on http://localhost:${env.PORT}`); });
    })
    .catch(logger.error);

export default app;
