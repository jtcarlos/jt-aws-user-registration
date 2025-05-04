import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb"

import { REGION } from "../utils/constants"
import { HTTPError } from "../utils/HTTPError"
import { methods } from "../../lib/apigateway/utils"
import { ICreatePayload, IDefaultReturn, IUser } from "../utils/types"

// initialize environment variables and constants
const BUCKET_NAME = process.env.BUCKET_NAME
const TABLE_NAME = process.env.TABLE_NAME
const CDN_URL = process.env.CDN_URL
const CONTENT_ENCODING = "base64"

// intialize S3 and DynamoDB clients
const s3Client = new S3Client({ region: REGION })
const dynamodbClient = new DynamoDBClient({ region: REGION })
const dynamodbDocumentClient = DynamoDBDocumentClient.from(dynamodbClient)

/**
 * @description Inserts a new user to the DynamoDB database
 * @param {ICreatePayload} context default context payload from API Gateway to Lambda integration
 * @returns {IDefaultReturn} Returns the inserted user document along with the user ID
 */
export const handler = async (context: ICreatePayload): Promise<IDefaultReturn> => {
  try {
    const { headers, body, httpMethod } = context
    const contentType = headers["Content-Type"]

    if (httpMethod !== methods.POST) throw new HTTPError(405, `Method Not Allowed: ${httpMethod}`)
    if (contentType !== "application/json") throw new HTTPError(406, `Content Not Acceptable: ${contentType}`)

    const parsedBody: IUser = JSON.parse(body)

    const { firstName, lastName, age, profilePicture } = parsedBody
    const { fileName, data: imageData } = profilePicture

    // upload profile picture
    const fileNameKey = `${firstName}_${lastName}-${fileName}`
    const decodedProfilePicture = Buffer.from(imageData.replace(/^data:image\/\w+;base64,/, ""), CONTENT_ENCODING)
    await s3Client.send(
      new PutObjectCommand({
        Key: fileNameKey,
        Bucket: BUCKET_NAME,
        Body: decodedProfilePicture,
        ContentEncoding: CONTENT_ENCODING,
        ContentType: imageData.split(":")[1].split(";")[0],
      })
    )

    // upload data to dynamoDB
    const parsedData = {
      user_id: crypto.randomUUID(),
      user_age: age,
      user_first_name: firstName,
      user_last_name: lastName,
      user_profile_picture: `${CDN_URL}/${fileNameKey}`,
    }

    await dynamodbDocumentClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: parsedData,
      })
    )

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "User Created", userDetails: parsedData }),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: JSON.stringify(error) }),
    }
  }
}
