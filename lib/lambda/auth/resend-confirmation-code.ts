import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import {
  CognitoIdentityProviderClient,
  ResendConfirmationCodeCommand,
} from "@aws-sdk/client-cognito-identity-provider";

interface ResendCodeBody {
  email: string;
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

    const body: ResendCodeBody = JSON.parse(event.body);
    const { email } = body;

    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "email is required",
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

    const command = new ResendConfirmationCodeCommand({
      ClientId: clientId,
      Username: email,
    });

    const response = await cognito.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Confirmation code sent successfully",
        delivery: response.CodeDeliveryDetails ?? null,
      }),
    };
  } catch (error: any) {
    if (error.name === "UserNotFoundException") {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: "User not found",
        }),
      };
    }

    if (error.name === "InvalidParameterException") {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Invalid request",
          details: error.message,
        }),
      };
    }

    if (error.name === "LimitExceededException") {
      return {
        statusCode: 429,
        body: JSON.stringify({
          message: "Too many requests",
          details: "Please wait before requesting another code.",
        }),
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: error.name || "InternalServerError",
        details: error.message || "Something went wrong",
      }),
    };
  }
};