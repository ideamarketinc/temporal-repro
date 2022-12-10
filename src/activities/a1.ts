import { Context } from "@temporalio/activity";
import { CustomContext } from "../activityInboundInterceptor";
import { s1, w2 } from "../workflows/w2";

export function getContext(): CustomContext {
  return Context.current() as CustomContext;
}

async function getIdsFromDatabase(): Promise<number[]> {
  return [1];
}

export async function a1() {
  const ids = await getIdsFromDatabase();
  const { workflowClient } = getContext();

  const signalOperations = ids.map((id) =>
    workflowClient.signalWithStart<typeof w2, []>(w2, {
      taskQueue: "default",
      workflowId: `w2-${id}`,
      args: [],
      signal: s1,
      signalArgs: [],
    })
  );

  await Promise.all(signalOperations);
}
