import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as nodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as path from "path";

export class UsersStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // USER POOL
    const userPool = new cognito.UserPool(this, "UsersPool", {
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      autoVerify: { email: true },
    });

    // USER POOL CLIENT
    const userPoolClient = new cognito.UserPoolClient(this, "UserPoolClient", {
      userPool,
      generateSecret: false,
      authFlows: {
        userPassword: true,
        userSrp: true,
      },
    });

    // SIGNUP LAMBDA
    const signUpFunction = new nodejs.NodejsFunction(this, "signUpFunction", {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: path.join(__dirname, "lambda/auth/signup.ts"),
      handler: "handler",
      environment: {
        USER_POOL_CLIENT: userPoolClient.userPoolClientId,
      },
    });

    // CONFIRM SIGNUP LAMBDA
    const confirmSignUpFunction = new nodejs.NodejsFunction(
      this,
      "confirmSignUpFunction",
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        entry: path.join(__dirname, "lambda/auth/confirm-signup.ts"),
        handler: "handler",
        environment: {
          USER_POOL_CLIENT: userPoolClient.userPoolClientId,
        },
      }
    );

    // RESEND CODE LAMBDA
    const resendConfirmationCodeFunction = new nodejs.NodejsFunction(
      this,
      "resendConfirmationCodeFunction",
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        entry: path.join(
          __dirname,
          "lambda/auth/resend-confirmation-code.ts"
        ),
        handler: "handler",
        environment: {
          USER_POOL_CLIENT: userPoolClient.userPoolClientId,
        },
      }
    );

    // SIGNIN LAMBDA
    const signInFunction = new nodejs.NodejsFunction(this, "signInFunction", {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: path.join(__dirname, "lambda/auth/signin.ts"),
      handler: "handler",
      environment: {
        USER_POOL_CLIENT: userPoolClient.userPoolClientId,
      },
    });
    // REFRESH TOKEN LAMBDA
const refreshTokenFunction = new nodejs.NodejsFunction(
  this,
  "refreshTokenFunction",
  {
    runtime: lambda.Runtime.NODEJS_20_X,
    entry: path.join(__dirname, "lambda/auth/refresh-token.ts"),
    handler: "handler",
    environment: {
      USER_POOL_CLIENT: userPoolClient.userPoolClientId,
    },
  }
);

    // ME LAMBDA
    const meFunction = new nodejs.NodejsFunction(this, "meFunction", {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: path.join(__dirname, "lambda/auth/me.ts"),
      handler: "handler",
      environment: {
        USER_POOL_ID: userPool.userPoolId,
        USER_POOL_CLIENT: userPoolClient.userPoolClientId,
      },
    });

    // FORGOT PASSWORD
    const forgotPasswordFunction = new nodejs.NodejsFunction(
      this,
      "forgotPasswordFunction",
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        entry: path.join(__dirname, "lambda/auth/forgot-password.ts"),
        handler: "handler",
        environment: {
          USER_POOL_CLIENT: userPoolClient.userPoolClientId,
        },
      }
    );
    // LOGOUT LAMBDA
const logoutFunction = new nodejs.NodejsFunction(this, "logoutFunction", {
  runtime: lambda.Runtime.NODEJS_20_X,
  entry: path.join(__dirname, "lambda/auth/logout.ts"),
  handler: "handler",
});
// CHANGE PASSWORD LAMBDA
const changePasswordFunction = new nodejs.NodejsFunction(
  this,
  "changePasswordFunction",
  {
    runtime: lambda.Runtime.NODEJS_20_X,
    entry: path.join(__dirname, "lambda/auth/change-password.ts"),
    handler: "handler",
  }
);

    // CONFIRM FORGOT PASSWORD
    const confirmForgotPasswordFunction = new nodejs.NodejsFunction(
      this,
      "confirmForgotPasswordFunction",
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        entry: path.join(
          __dirname,
          "lambda/auth/confirm-forgot-password.ts"
        ),
        handler: "handler",
        environment: {
          USER_POOL_CLIENT: userPoolClient.userPoolClientId,
        },
      }
    );

    // API
    const api = new apigateway.RestApi(this, "UsersApi", {
      restApiName: "Users Service",
      description: "API for user authentication",
    });
    // CHANGE PASSWORD ROUTE
const changePasswordResource = api.root.addResource("change-password");

changePasswordResource.addMethod(
  "POST",
  new apigateway.LambdaIntegration(changePasswordFunction)
);
    // REFRESH TOKEN ROUTE
const refreshTokenResource = api.root.addResource("refresh-token");

refreshTokenResource.addMethod(
  "POST",
  new apigateway.LambdaIntegration(refreshTokenFunction)
);

    // ROUTES

    const signUpResource = api.root.addResource("signup");
    signUpResource.addMethod(
      "POST",
      new apigateway.LambdaIntegration(signUpFunction)
    );
    // LOGOUT ROUTE
const logoutResource = api.root.addResource("logout");

logoutResource.addMethod(
  "POST",
  new apigateway.LambdaIntegration(logoutFunction)
);

    const confirmSignupResource = api.root.addResource("confirm-signup");
    confirmSignupResource.addMethod(
      "POST",
      new apigateway.LambdaIntegration(confirmSignUpFunction)
    );

    const resendResource = api.root.addResource("resend-confirmation-code");
    resendResource.addMethod(
      "POST",
      new apigateway.LambdaIntegration(resendConfirmationCodeFunction)
    );

    const signInResource = api.root.addResource("signin");
    signInResource.addMethod(
      "POST",
      new apigateway.LambdaIntegration(signInFunction)
    );

    const meResource = api.root.addResource("me");
    meResource.addMethod("GET", new apigateway.LambdaIntegration(meFunction));

    const forgotPasswordResource = api.root.addResource("forgot-password");
    forgotPasswordResource.addMethod(
      "POST",
      new apigateway.LambdaIntegration(forgotPasswordFunction)
    );

    const confirmForgotPasswordResource = api.root.addResource(
      "confirm-forgot-password"
    );
    confirmForgotPasswordResource.addMethod(
      "POST",
      new apigateway.LambdaIntegration(confirmForgotPasswordFunction)
    );

    // OUTPUTS

    new cdk.CfnOutput(this, "UserPoolId", {
      value: userPool.userPoolId,
    });

    new cdk.CfnOutput(this, "UserPoolClientId", {
      value: userPoolClient.userPoolClientId,
    });

    new cdk.CfnOutput(this, "SignupApiUrl", {
      value: `${api.url}signup`,
    });

    new cdk.CfnOutput(this, "ConfirmSignupApiUrl", {
      value: `${api.url}confirm-signup`,
    });

    new cdk.CfnOutput(this, "ResendCodeApiUrl", {
      value: `${api.url}resend-confirmation-code`,
    });

    new cdk.CfnOutput(this, "SigninApiUrl", {
      value: `${api.url}signin`,
    });

    new cdk.CfnOutput(this, "MeApiUrl", {
      value: `${api.url}me`,
    });

    new cdk.CfnOutput(this, "ForgotPasswordApiUrl", {
      value: `${api.url}forgot-password`,
    });
    new cdk.CfnOutput(this, "RefreshTokenApiUrl", {
  value: `${api.url}refresh-token`,
});
new cdk.CfnOutput(this, "LogoutApiUrl", {
  value: `${api.url}logout`,
});
new cdk.CfnOutput(this, "ChangePasswordApiUrl", {
  value: `${api.url}change-password`,
});

    new cdk.CfnOutput(this, "ConfirmForgotPasswordApiUrl", {
      value: `${api.url}confirm-forgot-password`,
    });
  }
}