import { Context } from "@temporalio/activity";
import { WorkflowClient } from "@temporalio/client";
import {
  ActivityInboundCallsInterceptor,
  ActivityExecuteInput,
  Next,
} from "@temporalio/worker";

export interface CustomContext extends Context {
  workflowClient: WorkflowClient;
}

export class CustomActivityInboundInterceptor
  implements ActivityInboundCallsInterceptor
{
  public readonly workflowClient: WorkflowClient;

  constructor(
    ctx: Context,
    { workflowClient }: { workflowClient: WorkflowClient }
  ) {
    this.workflowClient = workflowClient;
    (ctx as CustomContext).workflowClient = this.workflowClient;
  }

  execute(
    input: ActivityExecuteInput,
    next: Next<ActivityInboundCallsInterceptor, "execute">
  ): Promise<unknown> {
    return next(input);
  }
}
