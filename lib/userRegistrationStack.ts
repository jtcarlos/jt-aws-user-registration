import * as cdk from "aws-cdk-lib"
import { Construct } from "constructs"
import * as apigateway from "aws-cdk-lib/aws-apigateway"

import { rootHandlerStack } from "./lambda"
import { imageBucketStack } from "./s3/imageBucketStack"
import { devAPIStack } from "./apigateway/api/devAPIStack"
import { userDatabaseStack } from "./dynamodb/userDatabaseStack"
import { bucketDistributionStack } from "./cloudFront/bucketDistributionStack"

import { methods } from "./apigateway/utils"

export class UserRegistrationStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // S3 and CloudFront stack for image hosting and CDN
    const profilePictureBucket = imageBucketStack(this)
    const bucketDistribution = bucketDistributionStack(this, profilePictureBucket)

    // DynamDB stack for hosting user data
    userDatabaseStack(this)

    // API Gateway stack for exposing Lambda functions
    const devAPIGateway = devAPIStack(this)

    // Create Lambda stacks for handlers
    const rootLambdaFunction = rootHandlerStack(this)
    const rootLambdaTarget = new apigateway.LambdaIntegration(rootLambdaFunction)
    devAPIGateway.root.addMethod(methods.GET, rootLambdaTarget)

    new cdk.CfnOutput(this, "CloudFrontURL", {
      value: bucketDistribution.domainName,
    })
  }
}
