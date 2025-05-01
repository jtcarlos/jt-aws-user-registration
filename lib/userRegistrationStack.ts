import * as cdk from "aws-cdk-lib"
import { Construct } from "constructs"

import { imageBucketStack } from "./s3/imageBucketStack"
import { bucketDistributionStack } from "./cloudFront/bucketDistributionStack"

export class UserRegistrationStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // S3 and CloudFront stack for image hosting and CDN
    const profilePictureBucket = imageBucketStack(this)
    const bucketDistribution = bucketDistributionStack(this, profilePictureBucket)

    new cdk.CfnOutput(this, "CloudFrontURL", {
      value: bucketDistribution.domainName,
    })
  }
}
