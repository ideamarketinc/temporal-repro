import * as activities from "./activities";
import {
  appendDefaultInterceptors,
  Worker,
  defaultSinks,
} from "@temporalio/worker";
import { TestWorkflowEnvironment } from "@temporalio/testing";
import { CustomActivityInboundInterceptor } from "./activityInboundInterceptor";
import { w1 } from "./workflows/w1";
import { randomUUID } from "crypto";

describe("when performing w1", () => {
  let testEnv: TestWorkflowEnvironment;

  beforeEach(async () => {
    testEnv = await TestWorkflowEnvironment.createTimeSkipping();
  });

  afterEach(async () => {
    await testEnv.teardown();
  });

  it("skips time in w2 and runs a2", async () => {
    const testActivities = {
      ...activities,
      // override a2 so we can assert that it was calledk
      a2: jest.fn(),
    };

    const worker = await Worker.create({
      connection: testEnv.nativeConnection,
      workflowsPath: require.resolve("./workflows"),
      interceptors: appendDefaultInterceptors(
        {
          // pass time skipping workflow client to activities
          activityInbound: [
            (ctx) =>
              new CustomActivityInboundInterceptor(ctx, {
                workflowClient: testEnv.client.workflow,
              }),
          ],
        },
        console
      ),
      activities: testActivities,
      taskQueue: "default",
      sinks: defaultSinks(console),
    });

    // wait for w1 to complete
    await worker.runUntil(() =>
      testEnv.client.workflow.execute(w1, {
        workflowId: `w1-${randomUUID()}`,
        taskQueue: "default",
        args: [],
      })
    );

    // wait for w2 to complete
    // README: test fails here with timeout
    const handle = testEnv.client.workflow.getHandle("w2-1");
    await handle.result();

    expect(testActivities.a2).toHaveBeenCalled();
  });
});
