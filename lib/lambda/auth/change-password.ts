import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import {
  CognitoIdentityProviderClient,
  ChangePasswordCommand,
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
          message: "Invalid Authorization format",
        }),
      };
    }

    const accessToken = authHeader.split(" ")[1];

    const body = JSON.parse(event.body || "{}");
    const { oldPassword, newPassword } = body;

    if (!oldPassword || !newPassword) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "oldPassword and newPassword are required",
        }),
      };
    }

    const command = new ChangePasswordCommand({
      AccessToken: accessToken,
      PreviousPassword: oldPassword,
      ProposedPassword: newPassword,
    });

    await client.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Password changed successfully",
      }),
    };
  } catch (error: any) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Change password failed",
        error: error.message || "Unknown error",
      }),
    };
  }
};