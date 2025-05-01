import { Construct } from "constructs"
import { Bucket } from "aws-cdk-lib/aws-s3"
import * as cloudFront from "aws-cdk-lib/aws-cloudfront"
import * as origin from "aws-cdk-lib/aws-cloudfront-origins"

export const bucketDistributionStack = (scope: Construct, bucket: Bucket): cloudFront.Distribution => {
  return new cloudFront.Distribution(scope, "jt-user-registration-bucket-distribution-05012025", {
    defaultBehavior: {
      origin: origin.S3BucketOrigin.withOriginAccessControl(bucket),
      viewerProtocolPolicy: cloudFront.ViewerProtocolPolicy.HTTPS_ONLY,
    },
  })
}
