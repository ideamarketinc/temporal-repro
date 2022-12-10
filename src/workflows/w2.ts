import * as wf from "@temporalio/workflow";
import { proxyActivities, proxySinks, sleep } from "@temporalio/workflow";
import * as activities from "../activities";

export const s1 = wf.defineSignal<[]>("s1");

const { defaultWorkerLogger: logger } = proxySinks<wf.LoggerSinks>();

const { a2 } = proxyActivities<typeof activities>({
  startToCloseTimeout: "2 minutes",
});

export async function w2() {
  logger.info("getting stuck here", {});
  await sleep("7 days");

  logger.info("time skip successful", {});
  await a2();
}
