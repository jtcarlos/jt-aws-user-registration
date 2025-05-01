import { Construct } from "constructs"
import * as s3 from "aws-cdk-lib/aws-s3"
import * as cdk from "aws-cdk-lib"

export const imageBucketStack = (scope: Construct): s3.Bucket => {
  return new s3.Bucket(scope, "userImagesBuket", {
    autoDeleteObjects: true,
    removalPolicy: cdk.RemovalPolicy.DESTROY,
    encryption: s3.BucketEncryption.S3_MANAGED,
    bucketName: "jt-user-registration-bucket-05012025",
    blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
  })
}
