import * as path from "path"
import { Construct } from "constructs"
import * as lambda from "aws-cdk-lib/aws-lambda"

import { DEFAULT_FOLDER_PATH, DEFAULT_HANDLER_PATH } from "../utils"

export const rootHandlerStack = (scope: Construct): lambda.Function => {
  return new lambda.Function(scope, "rootLambdaStack", {
    runtime: lambda.Runtime.NODEJS_22_X,
    code: lambda.Code.fromAsset(path.join(__dirname, DEFAULT_FOLDER_PATH)),
    handler: DEFAULT_HANDLER_PATH,
  })
}
