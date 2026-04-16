import * as cdk from 'aws-cdk-lib';
import { UsersStack } from '../lib/users-stack';
import { ProductStack } from '../lib/product-stack';
import { AdsStack } from '../lib/ads-stacks';


const app = new cdk.App();

new UsersStack(app, 'UsersStack', {
  env: {
    account: '181591913834',
    region: 'eu-central-1',
  },
});

new ProductStack(app, 'ProductStack', {
  env: {
    account: '181591913834',
    region: 'eu-central-1',
  },
});
new AdsStack(app, 'AdsStack', {
  env: {
    account: '181591913834',
    region: 'eu-central-1',
  },
});