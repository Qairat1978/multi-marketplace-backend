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

    // =========================
    // 🧠 COGNITO
    // =========================
    const userPool = new cognito.UserPool(this, "UsersPool", {
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      autoVerify: { email: true },
    });

    const userPoolClient = new cognito.UserPoolClient(this, "UserPoolClient", {
      userPool,
      generateSecret: false,
      authFlows: {
        userPassword: true,
        userSrp: true,
      },
    });

    // =========================
    // ⚡ LAMBDAS
    // =========================
    const signUpFunction = this.createLambda("signUpFunction", "signup.ts", {
      USER_POOL_CLIENT: userPoolClient.userPoolClientId,
    });

    const confirmSignUpFunction = this.createLambda(
      "confirmSignUpFunction",
      "confirm-signup.ts",
      { USER_POOL_CLIENT: userPoolClient.userPoolClientId }
    );

    const resendCodeFunction = this.createLambda(
      "resendCodeFunction",
      "resend-confirmation-code.ts",
      { USER_POOL_CLIENT: userPoolClient.userPoolClientId }
    );

    const signInFunction = this.createLambda("signInFunction", "signin.ts", {
      USER_POOL_CLIENT: userPoolClient.userPoolClientId,
    });

    const refreshTokenFunction = this.createLambda(
      "refreshTokenFunction",
      "refresh-token.ts",
      { USER_POOL_CLIENT: userPoolClient.userPoolClientId }
    );

    const meFunction = this.createLambda("meFunction", "me.ts", {
      USER_POOL_ID: userPool.userPoolId,
      USER_POOL_CLIENT: userPoolClient.userPoolClientId,
    });

    const forgotPasswordFunction = this.createLambda(
      "forgotPasswordFunction",
      "forgot-password.ts",
      { USER_POOL_CLIENT: userPoolClient.userPoolClientId }
    );

    const confirmForgotPasswordFunction = this.createLambda(
      "confirmForgotPasswordFunction",
      "confirm-forgot-password.ts",
      { USER_POOL_CLIENT: userPoolClient.userPoolClientId }
    );

    const logoutFunction = this.createLambda("logoutFunction", "logout.ts");

    const changePasswordFunction = this.createLambda(
      "changePasswordFunction",
      "change-password.ts"
    );

    // =========================
    // 🌐 API
    // =========================
    const api = new apigateway.RestApi(this, "UsersApi", {
      restApiName: "Users Service",
      description: "Authentication API",
    });

    // =========================
    // 🔗 ROUTES
    // =========================
    this.addRoute(api, "signup", "POST", signUpFunction);
    this.addRoute(api, "confirm-signup", "POST", confirmSignUpFunction);
    this.addRoute(api, "resend-confirmation-code", "POST", resendCodeFunction);
    this.addRoute(api, "signin", "POST", signInFunction);
    this.addRoute(api, "refresh-token", "POST", refreshTokenFunction);
    this.addRoute(api, "logout", "POST", logoutFunction);
    this.addRoute(api, "change-password", "POST", changePasswordFunction);
    this.addRoute(api, "forgot-password", "POST", forgotPasswordFunction);
    this.addRoute(
      api,
      "confirm-forgot-password",
      "POST",
      confirmForgotPasswordFunction
    );
    this.addRoute(api, "me", "GET", meFunction);

    // =========================
    // 📤 OUTPUTS
    // =========================
    this.createOutput("UserPoolId", userPool.userPoolId);
    this.createOutput("UserPoolClientId", userPoolClient.userPoolClientId);

    this.createOutput("SignupApiUrl", `${api.url}signup`);
    this.createOutput("SigninApiUrl", `${api.url}signin`);
    this.createOutput("MeApiUrl", `${api.url}me`);
    this.createOutput("RefreshTokenApiUrl", `${api.url}refresh-token`);
    this.createOutput("LogoutApiUrl", `${api.url}logout`);
    this.createOutput("ChangePasswordApiUrl", `${api.url}change-password`);
    this.createOutput("ForgotPasswordApiUrl", `${api.url}forgot-password`);
    this.createOutput(
      "ConfirmForgotPasswordApiUrl",
      `${api.url}confirm-forgot-password`
    );
  }

  // =========================
  // 🔧 HELPERS
  // =========================

  private createLambda(
    name: string,
    file: string,
    env: Record<string, string> = {}
  ) {
    return new nodejs.NodejsFunction(this, name, {
      runtime: lambda.Runtime.NODEJS_22_X,
      entry: path.join(__dirname, `lambda/auth/${file}`),
      handler: "handler",
      environment: env,
    });
  }

  private addRoute(
    api: apigateway.RestApi,
    pathName: string,
    method: string,
    fn: lambda.Function
  ) {
    const resource = api.root.addResource(pathName);
    resource.addMethod(method, new apigateway.LambdaIntegration(fn));
  }

  private createOutput(name: string, value: string) {
    new cdk.CfnOutput(this, name, { value });
  }
}