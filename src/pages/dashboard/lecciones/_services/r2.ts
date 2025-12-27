import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const { 
  R2_BUCKET_NAME, 
  S3_REGION, 
  S3_ENDPOINT, 
  R2_ACCESS_KEY_ID, 
  R2_SECRET_ACCESS_KEY 
} = import.meta.env;

const s3 = new S3Client({ 
  region: S3_REGION,
  endpoint: S3_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

const key = `uploads/${crypto.randomUUID()}.mp4`; 
const command = new PutObjectCommand({
  Bucket: R2_BUCKET_NAME,
  Key: key,
  ContentType: "video/mp4"
});

export const uploadURL  = await getSignedUrl(s3, command, { expiresIn: 600 });
