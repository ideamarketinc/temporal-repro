import { proxyActivities } from "@temporalio/workflow";
import * as activities from "../activities";

const { a1 } = proxyActivities<typeof activities>({
  startToCloseTimeout: "2 minutes",
});

export async function w1() {
  await a1();
}
