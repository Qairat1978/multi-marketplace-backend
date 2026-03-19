import * as cdk from 'aws-cdk-lib';
import { UsersStack } from '../lib/users-stack';
import { ProductStack } from '../lib/product-stack';

const app = new cdk.App();

new UsersStack(app, 'UsersStack', {
  env: {
    account: '181591913834',
    region: 'us-east-1',
  },
});

new ProductStack(app, 'ProductStack', {
  env: {
    account: '181591913834',
    region: 'us-east-1',
  },
});