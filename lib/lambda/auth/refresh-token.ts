import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION || "us-east-1",
});

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const { refreshToken } = body;

    if (!refreshToken) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "refreshToken is required",
        }),
      };
    }

    const command = new InitiateAuthCommand({
      AuthFlow: "REFRESH_TOKEN_AUTH",
      ClientId: process.env.USER_POOL_CLIENT!,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
      },
    });

    const response = await client.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Token refreshed successfully",
        accessToken: response.AuthenticationResult?.AccessToken ?? null,
        idToken: response.AuthenticationResult?.IdToken ?? null,
        expiresIn: response.AuthenticationResult?.ExpiresIn ?? null,
        tokenType: response.AuthenticationResult?.TokenType ?? null,
      }),
    };
  } catch (error: any) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        message: "Refresh token failed",
        error: error.message || "Unauthorized",
      }),
    };
  }
};