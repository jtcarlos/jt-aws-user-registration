import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as cdk from 'aws-cdk-lib';

export const userDatabaseStack = (scope: Construct): dynamodb.TableV2 => {
  return new dynamodb.TableV2(scope, 'usersDatabaseStack', {
    partitionKey: {
      name: 'user_id',
      type: dynamodb.AttributeType.STRING,
    },
    sortKey: {
      name: 'user_age',
      type: dynamodb.AttributeType.NUMBER,
    },
    tableName: 'UsersDatabase',
    billing: dynamodb.Billing.onDemand(),
    removalPolicy: cdk.RemovalPolicy.DESTROY,
    encryption: dynamodb.TableEncryptionV2.awsManagedKey(),
  });
};
