import * as jwt from "jsonwebtoken";

export const APP_SECRET = "GraphQL-is-aw3some";

// when the server decodes an issued token, it should expect a response in this format.
export interface AuthTokenPayload {
  userId: number;
}

// The decodeAuthHeader function takes the Authorization header and parses it to return the payload of the JWT.
export function decodeAuthHeader(authHeader: String): AuthTokenPayload {
  const token = authHeader.replace("Bearer ", ""); // extract the token

  if (!token) {
    throw new Error("No token found");
  }
  return jwt.verify(token, APP_SECRET) as AuthTokenPayload; // decode and verify the token
}
