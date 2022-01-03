import express from "express";
import config from "config";
import connect from "./utils/connect";
import logger from "./utils/logger";
import routes from "./routes";

const port = config.get<number | null>("port");

const app = express();

app.use(express.json());

const listener = async () => {
  logger.info(`App is running http://localhost:${port}`);

  await connect();
  routes(app);
};

if (port) {
  app.listen(port, listener);
} else {
  app.listen(listener);
}
