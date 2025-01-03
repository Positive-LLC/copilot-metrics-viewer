import { App } from 'aws-cdk-lib';
import { ServiceStack } from './service';

const app = new App();
new ServiceStack(app, 'CopilotMetricsViewer', {
  serviceName: 'copilot-metrics-viewer',
  env: {
    account: "400827480311",
    region: "us-east-1",
  },
});