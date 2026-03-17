import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import {
  CognitoIdentityProviderClient,
  GlobalSignOutCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION || "us-east-1",
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

    const accessToken = authHeader.split(" ")[1];

    const command = new GlobalSignOutCommand({
      AccessToken: accessToken,
    });

    await client.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "User logged out successfully",
      }),
    };
  } catch (error: any) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Logout failed",
        error: error.message || "Unknown error",
      }),
    };
  }
};