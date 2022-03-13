import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';

export class MyPipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // need to set repo PAT as "github-token" w/ plain text token value

    const pipeline = new CodePipeline(this, 'Pipeline', {
      pipelineName: 'cdkPipeline',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('sleethma/cdk-pipeline', 'master'),
        commands: ['npm ci', 'npm run build', 'npx cdk synth'],
      }),
    });
  }
}
