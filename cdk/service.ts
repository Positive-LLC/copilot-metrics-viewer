import * as cdk from 'aws-cdk-lib';
// import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import { TagStatus } from 'aws-cdk-lib/aws-ecr';
import { Construct } from 'constructs';

export interface LambdaServiceProps extends cdk.StackProps {
  containerImagePath: string;  // Local path to your Dockerfile
  serviceName: string;
}

export class LambdaServiceStack extends cdk.Stack {
  public readonly functionUrl: string;

  constructor(scope: Construct, id: string, props: LambdaServiceProps) {
    super(scope, id, props);

    // Create ECR repository
    const repository = new ecr.Repository(this, `${props.serviceName}-repo`, {
      repositoryName: `${props.serviceName}-repo`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      emptyOnDelete: true,
      lifecycleRules: [
          {
            tagStatus: TagStatus.UNTAGGED,
            maxImageCount: 1,
            rulePriority: 1,
            description: 'Remove untagged images',
          },
        ],
    });

    /*
    // Create Lambda function from container image
    const lambdaFunction = new lambda.DockerImageFunction(this, `${props.serviceName}-function`, {
      functionName: `${props.serviceName}-function`,
      code: lambda.DockerImageCode.fromImageAsset(props.containerImagePath),
      memorySize: 1024,
      timeout: cdk.Duration.seconds(30),
      architecture: lambda.Architecture.ARM_64,
      environment: {
        VUE_APP_SCOPE: "organization",
        VUE_APP_GITHUB_API: "/api/github",
        VUE_APP_GITHUB_ORG: "Positive-LLC",
        VUE_APP_GITHUB_TOKEN: process.env.VUE_APP_GITHUB_TOKEN,
        SESSION_SECRET: process.env.SESSION_SECRET,
      },
    });

    // Add Function URL
    const functionUrl = lambdaFunction.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE, // Public access
      cors: {
        allowedOrigins: ['*'], // Adjust based on your needs
        allowedMethods: [lambda.HttpMethod.ALL],
        allowedHeaders: ['*'],
      },
    });

    // Output the Function URL
    new cdk.CfnOutput(this, 'LambdaFunctionUrl', {
      value: functionUrl.url,
      description: 'URL for the Lambda function',
      exportName: `${props.serviceName}-url`,
    });

    this.functionUrl = functionUrl.url;
     */
  }
}