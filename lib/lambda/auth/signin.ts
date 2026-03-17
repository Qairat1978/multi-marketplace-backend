import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";

interface SignInBody {
  email: string;
  password: string;
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

    const body: SignInBody = JSON.parse(event.body);
    const { email, password } = body;

    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "email and password are required",
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

    const command = new InitiateAuthCommand({
      ClientId: clientId,
      AuthFlow: "USER_PASSWORD_AUTH",
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    });

    const response = await cognito.send(command);

    const auth = response.AuthenticationResult;

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",

        // ACCESS TOKEN HEADER
        "Authorization": `Bearer ${auth?.AccessToken}`,

        // OPTIONAL HEADERS
        "X-Id-Token": auth?.IdToken ?? "",
        "X-Refresh-Token": auth?.RefreshToken ?? "",
      },
      body: JSON.stringify({
        message: "User signed in successfully",
        expiresIn: auth?.ExpiresIn ?? null,
        tokenType: auth?.TokenType ?? null,
      }),
    };

  } catch (error: any) {

    if (error.name === "NotAuthorizedException") {
      return {
        statusCode: 401,
        body: JSON.stringify({
          message: "Invalid email or password",
        }),
      };
    }

    if (error.name === "UserNotConfirmedException") {
      return {
        statusCode: 403,
        body: JSON.stringify({
          message: "User is not confirmed",
        }),
      };
    }

    if (error.name === "UserNotFoundException") {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: "User not found",
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