# AWS User Registration

A mini serverless API project that allows user to `create` / `read` / `update` / `delete` users.

The infrastructure behind the API is backed by the following AWS services:

- `AWS S3` - Hosts the profile pictures of the users.
- `AWS CloudFront` - CDN for the S3 file hosting.
- `AWS DynamoDB` - Hosts the data of the users.
- `AWS Lambda` - Hosts the API logic.
- `AWS API Gateway` - Exposes an endpoint to trigger the `AWS Lambda` functions.

Other Tools Used

- `AWS CDK` - Allows management of the underlying infrastructure through code (IaC).

## Features

- Basic CRUD operations of the user data
- Low latency file delivery through `AWS CloudFront`
- API data caching for fast API responses

## Running / Testing the API

> [!WARNING]  
> Not yet implemented
