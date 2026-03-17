import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { CognitoJwtVerifier } from "aws-jwt-verify";

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.USER_POOL_ID!,
  tokenUse: "access",
  clientId: process.env.USER_POOL_CLIENT!,
});

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const authHeader =
      event.headers.authorization || event.headers.Authorization;

    if (!authHeader) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          message: "Missing Authorization header",
        }),
      };
    }

    if (!authHeader.startsWith("Bearer ")) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          message: "Invalid Authorization header format",
        }),
      };
    }

    const token = authHeader.split(" ")[1];

    const payload = await verifier.verify(token);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "User fetched successfully",
        user: {
          sub: payload.sub,
          username: payload.username,
          clientId: payload.client_id,
          tokenUse: payload.token_use,
          scope: payload.scope ?? null,
          authTime: payload.auth_time ?? null,
          exp: payload.exp ?? null,
          iat: payload.iat ?? null,
        },
      }),
    };
  } catch (error: any) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        message: "Invalid or expired token",
        details: error.message || "Unauthorized",
      }),
    };
  }
};