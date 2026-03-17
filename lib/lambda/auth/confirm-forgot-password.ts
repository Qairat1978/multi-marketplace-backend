import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import {
  CognitoIdentityProviderClient,
  ConfirmForgotPasswordCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION || "us-east-1",
});

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");

    const { email, code, newPassword } = body;

    if (!email || !code || !newPassword) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "email, code and newPassword are required",
        }),
      };
    }

    const command = new ConfirmForgotPasswordCommand({
      ClientId: process.env.USER_POOL_CLIENT!,
      Username: email,
      ConfirmationCode: code,
      Password: newPassword,
    });

    await client.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Password reset successfully",
      }),
    };
  } catch (error: any) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Confirm forgot password failed",
        error: error.message || "Unknown error",
      }),
    };
  }
};