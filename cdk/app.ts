import { App } from 'aws-cdk-lib';
import { LambdaServiceStack } from './service';

const app = new App();
new LambdaServiceStack(app, 'CopilotMetricsViewer', {
  containerImagePath: '../api.Dockerfile',
  serviceName: 'copilot-metrics-viewer',
  env: {
    account: "400827480311",
    region: "us-east-1",
  },
});