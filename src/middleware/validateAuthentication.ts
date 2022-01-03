import { get } from "lodash";
import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt.utils";
import { reIssueAccessToken } from "../service/session.service";
import log from "../utils/logger";

const validateAuthentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = get(req, "headers.authorization", "").replace(
    /^Bearer\s/,
    ""
  );

  const refreshToken = get(req, "headers.x-refresh");

  // if no access token is provided we return an error
  if (!accessToken) {
    return res.status(403).send("Access token was not provided");
  }

  if (accessToken) {
    const { decoded, expired } = verifyJwt(accessToken);
    if (decoded) {
      res.locals.user = decoded;
    }

    // if the access token is expired we can use the refreshToken to generate a new one
    if (expired && refreshToken) {
      log.info("Expired access token");
      const newAccessToken = await reIssueAccessToken({ refreshToken });
      if (newAccessToken) {
        res.setHeader("x-access-token", newAccessToken);
        const result = verifyJwt(newAccessToken);
        res.locals.user = result.decoded;
      }
    }
  }

  return next();
};

export default validateAuthentication;
