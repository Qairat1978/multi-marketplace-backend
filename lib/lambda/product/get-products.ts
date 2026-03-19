import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});

export const handler = async () => {
  const data = await client.send(
    new ScanCommand({
      TableName: process.env.PRODUCTS_TABLE,
    })
  );

  const items =
  data.Items?.map((item: any) => ({
    id: item.id?.S,
    title: item.title?.S,
    price: item.price?.N ? Number(item.price.N) : 0,
  })) || [];

  return {
    statusCode: 200,
    body: JSON.stringify(items),
  };
};