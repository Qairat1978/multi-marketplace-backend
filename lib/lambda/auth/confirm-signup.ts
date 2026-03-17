import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import {
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";

interface ConfirmSignUpBody {
  email: string;
  code: string;
}

const cognito = new CognitoIdentityProviderClient({});

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Missing request body",
        }),
      };
    }

    const body: ConfirmSignUpBody = JSON.parse(event.body);
    const { email, code } = body;

    if (!email || !code) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "email and code are required",
        }),
      };
    }

    const clientId = process.env.USER_POOL_CLIENT;

    if (!clientId) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "USER_POOL_CLIENT is not configured",
        }),
      };
    }

    const command = new ConfirmSignUpCommand({
      ClientId: clientId,
      Username: email,
      ConfirmationCode: code,
    });

    await cognito.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "User confirmed successfully",
      }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: error.name || "InternalServerError",
        details: error.message || "Something went wrong",
      }),
    };
  }
};