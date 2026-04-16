import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";

const dynamoDBClient = new DynamoDBClient({});

export const handler: APIGatewayProxyHandlerV2 = async () => {
  try {
    const result = await dynamoDBClient.send(
      new ScanCommand({
        TableName: process.env.PRODUCTS_TABLE!,
      })
    );

    // 🔹 DynamoDB format → normal JSON
    const products = result.Items?.map((item) => ({
      id: item.id.S,
      productName: item.productName.S,
      description: item.description.S,
      category: item.category.S,
      quantity: Number(item.quantity.N),
      price: Number(item.price.N),
      image: item.image.S,
      vendorId: item.vendorId.S,
      approved: item.approved.BOOL,
      createdAt: item.createdAt.S,
    })) || [];

    return {
      statusCode: 200,
      body: JSON.stringify(products),
    };
  } catch (error: any) {
    console.error("Get Products Error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to fetch products",
        details: error.message,
      }),
    };
  }
};