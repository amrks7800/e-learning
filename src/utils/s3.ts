import { S3 } from "aws-sdk";
import { Upload } from "@aws-sdk/lib-storage";
import { config } from "../config/config";
import type { Request } from "express";
import { v4 as uuid } from "uuid";

const s3 = new S3({
  region: config.bucket.region,
  credentials: {
    accessKeyId: config.bucket.keyId,
    secretAccessKey: config.bucket.keySecret,
  },
  endpoint: config.bucket.endpoint,
  s3ForcePathStyle: true,
  signatureVersion: "v4",
});

export const generateSignedUrl = (key: string): string => {
  const params = {
    Bucket: config.bucket.name,
    Key: key,
    Expires: 60 * 60 * 24 * 7,
  };

  return s3.getSignedUrl("getObject", params);
};

export const uploadToS3 = async (file: Request["file"]) => {
  const fileKey = `${uuid()}-${file.originalname}`;

  console.log(file);

  try {
    const result = await s3
      .upload({
        Bucket: config.bucket.name,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
      .promise();

    console.log(result.Location);

    const signedUrl = generateSignedUrl(fileKey);

    return { secure_url: signedUrl, ...result };
  } catch (error) {
    console.error("Upload to S3 error:", error);
    return null;
  }
};
