import { Region } from "@nut-tree-fork/nut-js";
import { sleep } from "radash";
import {
  clickperc,
  concede,
  passBattleSummary,
  clicknext,
  thankBattle,
  clickbattle,
  startPrivateMatch,
  getWindow,
} from "./utils";

const MATCH_TYPE: "random" | "private" = "random";

const window = await getWindow("mumu player 12");
await window.focus();

const region = await window.getRegion();

// go to battle
await clickperc(region, 0.7, 0.95);
await sleep(2500);

// go to versus
await clickperc(region, 0.3, 0.75);
await sleep(1000);

if (MATCH_TYPE === "random") {
  // go to random match
  await clickperc(region, 0.8, 0.75);
  await startRandomMatchLoop(region);
} else {
  // go to private match
  await startPrivateMatch(region, "bbcoq1");
  await startPrivateMatchLoop(region);
}

async function startPrivateMatchLoop(region: Region) {
  while (true) {
    await concede(region);
    await passBattleSummary(region);
    await thankBattle(region);
    await clickbattle(region);
  }
}

export async function startRandomMatchLoop(region: Region) {
  while (true) {
    // start battle
    await sleep(2000);
    await clickperc(region, 0.5, 0.8);

    const conceded = await concede(region);
    if (conceded) {
      await passBattleSummary(region);
    } else {
      await clicknext(region);
      await sleep(2000);
    }
    await thankBattle(region);
  }
}
