import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as path from "path";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as nodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";

export class AdsStack extends cdk.Stack {
  public readonly bucket: s3.Bucket;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ✅ S3 Bucket
    this.bucket = new s3.Bucket(this, "UploadBucket", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      
      bucketName: "multi-market-place-images-kairat",

      
      
    });

    // ✅ Lambda
    const getUploadUrlLambda = new nodejs.NodejsFunction(
      this,
      "GetUploadUrlLambda",
      {
        runtime: lambda.Runtime.NODEJS_22_X,
        entry: path.join(__dirname, "lambda/ads/get-upload-url.ts"),
        handler: "handler", 
        environment: {
          BUCKET_NAME: this.bucket.bucketName,
        },
      }
    );

    // ✅ Permission
    this.bucket.grantPut(getUploadUrlLambda);

    // ✅ API Gateway
    const api = new apigateway.RestApi(this, "UploadAPI", {
      restApiName: "Upload Service",
      deployOptions: {
        stageName: "dev",
      },
    });

    const uploadUrl = api.root.addResource("upload-url");
    uploadUrl.addMethod(
      "POST",
      new apigateway.LambdaIntegration(getUploadUrlLambda)
    );

    // ✅ Outputs
    new cdk.CfnOutput(this, "BucketName", {
      value: this.bucket.bucketName,
    });

    new cdk.CfnOutput(this, "UploadUrlEndpoint", {
      value: `${api.url}upload-url`,
    });
  }
}