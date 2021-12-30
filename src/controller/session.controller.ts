import { Request, Response } from "express";
import config from "config";
import { createSession } from "../service/session.service";
import { validatePassword } from "../service/user.service";
import { signJwt } from "../utils/jwt.utils";
export async function createSessionHandler(req: Request, res: Response) {
  // validate user password
  const user = await validatePassword(req.body);

  if (!user) {
    return res.status(401).send("Invalid email or password");
  }

  // create a session
  const session = await createSession(
    user._id.toString(),
    req.get("user-agent") || ""
  );
  console.log(session);

  // create an access token
  const accessToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get<string>("accessTokenTimeTtl") } // 15 minutes
  );

  //   console.log(accessToken);

  // create a refresh token
  const refreshToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get<string>("refreshTokenTtl") } // 15 minutes
  );

  console.log(refreshToken);
  // return access and refresh token
  return res.send({ accessToken, refreshToken });
}
