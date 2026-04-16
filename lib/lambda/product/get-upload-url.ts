import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { randomUUID } from "crypto";

const s3Client = new S3Client({});

interface UploadUrlBody {
  fileName: string;
  fileType: string;
  vendorId: string;
}

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    // 🔹 1. Body тексеру
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing request body" }),
      };
    }

    // 🔹 2. Parse
    const { fileName, fileType, vendorId } =
      JSON.parse(event.body) as UploadUrlBody;

    // 🔹 3. Validation (ТЕК 3 FIELD)
    if (!fileName || !fileType || !vendorId) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "fileName, fileType, vendorId required",
        }),
      };
    }

    // 🔹 4. Unique key (өте маңызды)
    const uniqueId = randomUUID();
    const key = `products/${vendorId}/${uniqueId}-${fileName}`;

    // 🔹 5. S3 command
    const command = new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME!,
      Key: key,
      ContentType: fileType,
    });

    // 🔹 6. Signed URL
    const uploadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });

    // 🔹 7. Response
    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadUrl,
        key,
      }),
    };
  } catch (error: any) {
    console.error("Upload URL Error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to generate upload URL",
        details: error.message,
      }),
    };
  }
};