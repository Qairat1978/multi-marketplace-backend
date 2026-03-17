import * as cdk from 'aws-cdk-lib';
import { UsersStack } from '../lib/users-stack';

const app = new cdk.App();

new UsersStack(
  app,
  'UsersStack', // unique stack name
  {
    env: {
      account: '181591913834',
      region: 'us-east-1',
    },
  }
);