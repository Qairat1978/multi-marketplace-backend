import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from "uuid";

const client = new DynamoDBClient({});

export const handler = async (event: any) => {
  const body = JSON.parse(event.body);

  const { title, description, price } = body;

  if (!title || !price) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Title and price required" }),
    };
  }

  const id = uuidv4();

  await client.send(
    new PutItemCommand({
      TableName: process.env.PRODUCTS_TABLE,
      Item: {
        id: { S: id },
        title: { S: title },
        description: { S: description || "" },
        price: { N: price.toString() },
        createdAt: { S: new Date().toISOString() },
      },
    })
  );

  return {
    statusCode: 201,
    body: JSON.stringify({ message: "Product created", id }),
  };
};