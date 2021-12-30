import jwt, { JwtPayload } from "jsonwebtoken";
import config from "config";

const privateKey = config.get<string>("privateKey");
const publicKey = config.get<string>("publicKey");

export function signJwt(
  object: Object,
  options?: jwt.SignOptions | undefined
): string {
  return jwt.sign(object, privateKey, {
    ...(options && options),
    algorithm: "RS256",
  });
}

export function verifyJwt(token: string): {
  valid: boolean;
  expired: boolean;
  decoded: string | JwtPayload | null;
} {
  try {
    const decoded = jwt.verify(token, publicKey);
    return {
      valid: true,
      expired: false,
      decoded: decoded,
    };
  } catch (error: any) {
    return {
      valid: false,
      expired: error.message === "jwt expired",
      decoded: null,
    };
  }
}
