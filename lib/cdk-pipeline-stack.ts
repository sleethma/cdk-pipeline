import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ManualApprovalStep, ShellStep } from 'aws-cdk-lib/pipelines';
import { DeployLambdasAppStage } from './app-stage';

export class MyPipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // need to set repo PAT as "github-token" w/ plain text token value

    const pipeline = new CodePipeline(this, 'Pipeline', {
      crossAccountKeys: true,
      pipelineName: 'cdkPipeline',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('sleethma/cdk-pipeline', 'master'),
        commands: ['npm ci', 'npm run build', 'npx cdk synth'],
      }),
    });
    // const lambdaStage = pipeline.addStage(

    const wave = pipeline.addWave('wave');
    wave.addStage(
      new DeployLambdasAppStage(this, 'lambda-backend-stage-t2', {
        env: { account: '273049437864', region: 'us-west-2' },
      })
    );
    wave.addStage(
      new DeployLambdasAppStage(this, 'lambda-backend-stage-personal', {
        env: { account: '500573939214', region: 'us-east-1' },
      })
    );

    wave.addPost(new ManualApprovalStep('approval'));
  }
}
