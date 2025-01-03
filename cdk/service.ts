import * as cdk from 'aws-cdk-lib';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as apprunner from '@aws-cdk/aws-apprunner-alpha';
import { TagStatus } from 'aws-cdk-lib/aws-ecr';
import { Construct } from 'constructs';
import { Cpu, Memory } from "@aws-cdk/aws-apprunner-alpha";

export interface ServiceProps extends cdk.StackProps {
  serviceName: string;
}

export class ServiceStack extends cdk.Stack {
  public readonly serviceUrl: string;

  constructor(scope: Construct, id: string, props: ServiceProps) {
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

    // Create App Runner service
    const appRunnerService = new apprunner.Service(this, `${props.serviceName}-service`, {
      source: apprunner.Source.fromEcr({
        repository,
        imageConfiguration: {
          port: 3000,
          environmentVariables: {
            PORT: "3000",
            VUE_APP_SCOPE: "organization",
            VUE_APP_GITHUB_API: "/api/github",
            VUE_APP_GITHUB_ORG: "Positive-LLC",
            VUE_APP_GITHUB_TOKEN: process.env.VUE_APP_GITHUB_TOKEN!,
            SESSION_SECRET: process.env.SESSION_SECRET!,
          },
        },
        tagOrDigest: 'latest',
      }),
      cpu: Cpu.QUARTER_VCPU,
      memory: Memory.HALF_GB,
      autoScalingConfiguration: new apprunner.AutoScalingConfiguration(this, 'AutoScalingConfiguration', {
        autoScalingConfigurationName: `${props.serviceName}-config`,
        maxConcurrency: 100,
        maxSize: 2,
        minSize: 1,
      }),
    });

    // Output the Service URL
    new cdk.CfnOutput(this, 'AppRunnerServiceUrl', {
      value: appRunnerService.serviceUrl,
      description: 'URL for the App Runner service',
      exportName: `${props.serviceName}-url`,
    });

    this.serviceUrl = appRunnerService.serviceUrl;
  }
}