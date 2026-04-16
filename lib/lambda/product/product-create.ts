import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { randomUUID } from "crypto";

const dynamoDBClient = new DynamoDBClient({});

interface CreateProductBody {
  productName: string;
  description: string;
  category: string;
  quantity: number;
  price: number;
  image: string; // S3 key (get-upload-url-тен келеді)
  vendorId: string;
}

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    // 🔹 1. BODY CHECK
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing request body" }),
      };
    }

    // 🔹 2. PARSE
    const {
      productName,
      description,
      category,
      quantity,
      price,
      image,
      vendorId,
    } = JSON.parse(event.body) as CreateProductBody;

    // 🔹 3. VALIDATION
    if (
      !productName ||
      !description ||
      !category ||
      !quantity ||
      !price ||
      !image ||
      !vendorId
    ) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "All fields are required" }),
      };
    }

    // 🔹 4. PRODUCT ID
    const productId = randomUUID();

    // 🔹 5. SAVE TO DB
    await dynamoDBClient.send(
      new PutItemCommand({
        TableName: process.env.PRODUCTS_TABLE!,
        Item: {
          id: { S: productId },
          productName: { S: productName },
          description: { S: description },
          category: { S: category },
          quantity: { N: quantity.toString() },
          price: { N: price.toString() },
          image: { S: image }, // S3 key
          vendorId: { S: vendorId },

          // 🔥 extra fields (production)
          approved: { BOOL: false },
          status: { S: "PENDING" }, // admin approve үшін
          createdAt: { S: new Date().toISOString() },
        },
      })
    );

    // 🔹 6. RESPONSE
    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "Product created successfully",
        productId,
      }),
    };
  } catch (error: any) {
    console.error("Create Product Error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal server error",
        details: error.message,
      }),
    };
  }
};