import { Express, Request, Response } from "express";
import {
  createSessionHandler,
  deleteSessionhandler,
  getUserSessionsHandler,
} from "./controller/session.controller";
import { createUserHandler } from "./controller/user.controller";
import validateAuthentication from "./middleware/validateAuthentication";
import validateResource from "./middleware/validateResource";
import { createSessionSchema } from "./schema/session.schema";
import { createUserSchema } from "./schema/user.schema";

function routes(app: Express) {
  app.get("/healthcheck", (req: Request, res: Response) => res.sendStatus(200));

  app.post("/api/users", validateResource(createUserSchema), createUserHandler);

  app.post(
    "/api/sessions",
    validateResource(createSessionSchema),
    createSessionHandler
  );

  app.get("/api/sessions", validateAuthentication, getUserSessionsHandler);

  app.delete("/api/sessions", validateAuthentication, deleteSessionhandler);

  app.get(
    "/api/products",
    validateAuthentication,
    (req: Request, res: Response) => {}
  );
}

export default routes;
