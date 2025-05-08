import * as apiGateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

import { stages } from '../utils';

export const devAPIStack = (scope: Construct): apiGateway.RestApi => {
  return new apiGateway.RestApi(scope, 'devAPIStack', {
    restApiName: stages.dev,
    description: `${stages.dev.toUpperCase()} stage API Gateway`,
    deployOptions: {
      stageName: stages.dev,
    },
  });
};
