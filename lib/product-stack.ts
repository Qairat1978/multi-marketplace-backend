import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
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
      removalPolicy: cdk.RemovalPolicy.DESTROY, // dev үшін (prod-та REMOVE)
    });

    // =========================
    // ⚡ Lambda: CREATE PRODUCT
    // =========================
    const createProduct = new nodejs.NodejsFunction(this, 'CreateProductFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
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
      runtime: lambda.Runtime.NODEJS_20_X,
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
      description: 'API for product management',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    // =========================
    // 📦 Routes
    // =========================
    const products = this.api.root.addResource('products');

    // POST /products
    products.addMethod(
      'POST',
      new apigateway.LambdaIntegration(createProduct)
    );

    // GET /products
    products.addMethod(
      'GET',
      new apigateway.LambdaIntegration(getProducts)
    );

    // =========================
    // 📤 Outputs
    // =========================
    new cdk.CfnOutput(this, 'ProductApiBaseUrl', {
      value: this.api.url,
    });

    new cdk.CfnOutput(this, 'CreateProductApiUrl', {
      value: `${this.api.url}products`,
    });

    new cdk.CfnOutput(this, 'GetProductsApiUrl', {
      value: `${this.api.url}products`,
    });

    new cdk.CfnOutput(this, 'ProductsTableName', {
      value: productsTable.tableName,
    });
  }
}