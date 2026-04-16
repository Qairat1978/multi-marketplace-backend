import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as path from 'path';

export class ProductStack extends cdk.Stack {
  public readonly api: apigateway.RestApi;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // =========================
    // 🗄️ DynamoDB Table
    // =========================
    const productsTable = new dynamodb.Table(this, 'ProductsTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // =========================
    // 🔥 GSI (IMPORTANT)
    // =========================
    productsTable.addGlobalSecondaryIndex({
      indexName: 'category-index',
      partitionKey: { name: 'category', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING },
    });

    productsTable.addGlobalSecondaryIndex({
      indexName: 'vendorId-index',
      partitionKey: { name: 'vendorId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING },
    });

    // =========================
    // 🪣 S3 Bucket
    // =========================
    const productBucket = new s3.Bucket(this, 'ProductImagesBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // =========================
    // ⚡ Lambda: GET UPLOAD URL
    // =========================
    const getUploadUrl = new nodejs.NodejsFunction(this, 'GetUploadUrlFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      entry: path.join(__dirname, 'lambda/product/get-upload-url.ts'),
      handler: 'handler',
      environment: {
        BUCKET_NAME: productBucket.bucketName,
      },
    });

    productBucket.grantPut(getUploadUrl);

    // =========================
    // ⚡ Lambda: CREATE PRODUCT
    // =========================
    const createProduct = new nodejs.NodejsFunction(this, 'CreateProductFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      entry: path.join(__dirname, 'lambda/product/product-create.ts'),
      handler: 'handler',
      environment: {
        PRODUCTS_TABLE: productsTable.tableName,
      },
    });

    productsTable.grantWriteData(createProduct);

    // =========================
    // ⚡ Lambda: GET PRODUCTS
    // =========================
    const getProducts = new nodejs.NodejsFunction(this, 'GetProductsFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      entry: path.join(__dirname, 'lambda/product/get-products.ts'),
      handler: 'handler',
      environment: {
        PRODUCTS_TABLE: productsTable.tableName,
      },
    });

    productsTable.grantReadData(getProducts);

    // =========================
    // 🌐 API Gateway
    // =========================
    this.api = new apigateway.RestApi(this, 'ProductApi', {
      restApiName: 'Product Service',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    // =========================
    // 📦 Routes
    // =========================
    const products = this.api.root.addResource('products');
    const upload = this.api.root.addResource('upload-url');

    // POST /products
    products.addMethod('POST', new apigateway.LambdaIntegration(createProduct));

    // GET /products
    products.addMethod('GET', new apigateway.LambdaIntegration(getProducts));

    // POST /upload-url
    upload.addMethod('POST', new apigateway.LambdaIntegration(getUploadUrl));

    // =========================
    // 📤 Outputs
    // =========================
    new cdk.CfnOutput(this, 'API_URL', {
      value: this.api.url,
    });

    new cdk.CfnOutput(this, 'UploadUrlEndpoint', {
      value: `${this.api.url}upload-url`,
    });

    new cdk.CfnOutput(this, 'ProductsEndpoint', {
      value: `${this.api.url}products`,
    });

    new cdk.CfnOutput(this, 'BucketName', {
      value: productBucket.bucketName,
    });
  }
}