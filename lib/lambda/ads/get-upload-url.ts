import { APIGatewayProxyHandler } from "aws-lambda";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

const s3 = new S3Client({ region: process.env.AWS_REGION });

export const getUploadUrl: APIGatewayProxyHandler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");

    const fileName = body.fileName;
    const fileType = body.fileType;

    if (!fileName || !fileType) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "fileName and fileType required" }),
      };
    }

    // unique file name
    const key = `uploads/${uuidv4()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME!,
      Key: key,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3, command, {
      expiresIn: 3600, // 1 minute
    });

    const fileUrl = `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/${key}`;

    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadUrl,
        fileUrl,
        key,
      }),
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};