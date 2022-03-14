import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { LambdaBackend } from './lambda-backend-stack';

export class DeployLambdasAppStage extends cdk.Stage {
  constructor(scope: Construct, id: string, props?: cdk.StageProps) {
    super(scope, id, props);

    const lambdaStack = new LambdaBackend(this, 'LambdaStack');
  }
}
