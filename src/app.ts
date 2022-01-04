import express from "express";
import config from "config";
import connect from "./utils/connect";
import routes from "./routes";
import log from "./utils/logger";

const port = process.env.PORT || config.get<number | null>("port");

const app = express();

app.use(express.json());

const listener = async () => {
  log.info(`App is running, port: ${port}`);

  await connect();
  routes(app);
};

if (port) {
  app.listen(port, listener);
} else {
  app.listen(listener);
}
