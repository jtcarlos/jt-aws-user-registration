import * as path from "path"
import { Construct } from "constructs"
import * as lambda from "aws-cdk-lib/aws-lambda"

import { DEFAULT_HANDLER_PATH, DEFAULT_FOLDER_PATH } from "../../../application/utils/constants"

interface ICreateHandler {
  scope: Construct
  bucketName: string
  tableName: string
  cdnURL: string
}

export const createHandlerStack = (stackPayload: ICreateHandler): lambda.Function => {
  const { scope, bucketName, tableName, cdnURL } = stackPayload

  return new lambda.Function(scope, "createLambdaStack", {
    runtime: lambda.Runtime.NODEJS_22_X,
    code: lambda.Code.fromAsset(path.join(__dirname, DEFAULT_FOLDER_PATH, "/create")),
    handler: DEFAULT_HANDLER_PATH,
    environment: {
      BUCKET_NAME: bucketName,
      TABLE_NAME: tableName,
      CDN_URL: cdnURL,
    },
  })
}
