import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

import { imageBucketStack } from './s3/imageBucketStack';
import { devAPIStack } from './apigateway/api/devAPIStack';
import { userDatabaseStack } from './dynamodb/userDatabaseStack';
import { bucketDistributionStack } from './cloudFront/bucketDistributionStack';
import { rootHandlerStack, createHandlerStack } from './lambda';

import { methods } from './apigateway/utils';

export class UserRegistrationStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3 and CloudFront stack for image hosting and CDN
    const profilePictureBucket = imageBucketStack(this);
    const bucketDistribution = bucketDistributionStack(
      this,
      profilePictureBucket
    );
    const createdBucketName = profilePictureBucket.bucketName;
    const bucketDistributionURL = bucketDistribution.domainName;

    // DynamDB stack for hosting user data
    const userTable = userDatabaseStack(this);
    const createdTableName = userTable.tableName;

    // API Gateway stack for exposing Lambda functions
    const devAPIGateway = devAPIStack(this);

    // Create Lambda stacks for handlers
    const lambdaStackPayload = {
      scope: this,
      tableName: createdTableName,
      cdnURL: bucketDistributionURL,
      bucketName: createdBucketName,
    };

    // Root lambda handler
    const rootLambdaFunction = rootHandlerStack(this);
    const rootLambdaTarget = new apigateway.LambdaIntegration(
      rootLambdaFunction
    );
    devAPIGateway.root.addMethod(methods.GET, rootLambdaTarget);

    // Create user lambda handler
    const createLambdaFunction = createHandlerStack(lambdaStackPayload);
    const createRoute = devAPIGateway.root.addResource('create');
    createRoute.addMethod(
      methods.POST,
      new apigateway.LambdaIntegration(createLambdaFunction)
    );
    profilePictureBucket.grantWrite(createLambdaFunction);
    userTable.grantWriteData(createLambdaFunction);

    new cdk.CfnOutput(this, 'CloudFrontURL', {
      value: bucketDistributionURL,
    });
  }
}
