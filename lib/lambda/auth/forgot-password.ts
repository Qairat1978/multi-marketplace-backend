import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import {
  CognitoIdentityProviderClient,
  ForgotPasswordCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION || "us-east-1",
});

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const { email } = body;

    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Email is required",
        }),
      };
    }

    const command = new ForgotPasswordCommand({
      ClientId: process.env.USER_POOL_CLIENT!,
      Username: email,
    });

    await client.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Password reset code sent to email",
      }),
    };
  } catch (error: any) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Forgot password failed",
        error: error.message || "Unknown error",
      }),
    };
  }
};