import {
  Region,
  keyboard,
  mouse,
  straightTo,
  screen,
  getWindows,
  Window,
} from "@nut-tree-fork/nut-js";
import { reduce, sleep } from "radash";

export async function getWindow(title: string) {
  const windows = await getWindows();
  const window = await reduce(
    windows,
    async (acc, win) => {
      const title = await win.title;
      if (title.toLowerCase().includes("mumu player 12")) {
        return win;
      }
      return acc;
    },
    null as Window | null
  )!;

  if (!window) {
    throw new Error("Window not found");
  }
  return window;
}

export async function thankBattle(region: Region) {
  await clickperc(region, 0.5, 0.8);
  await sleep(2000);
  await clicknext(region);
  await sleep(4000);
}

export async function passBattleSummary(region: Region) {
  await clicknext(region);
  await sleep(1000);
  await clicknext(region);
  await sleep(1000);
}

export async function concede(region: Region) {
  const found = await waitcolors(
    region,
    0.1,
    0.85,
    ["#5a6c86ff", "#636f7cff"],
    2 * 60 * 1000
  );
  if (!found) {
    return false;
  }
  await sleep(2000);
  await clickperc(region, 0.1, 0.85);
  await sleep(1000);
  await clickperc(region, 0.4, 0.65);
  await sleep(1000);
  await clickperc(region, 0.5, 0.6);
  await sleep(8000);
  return true;
}

export async function startPrivateMatch(region: Region, pass: string) {
  await clickperc(region, 0.3, 0.75);
  await sleep(2000);
  await clickperc(region, 0.5, 0.35);
  await sleep(1000);
  await clickperc(region, 0.5, 0.7);
  await sleep(2000);
  await clickperc(region, 0.5, 0.45);
  await sleep(2000);
  await keyboard.type(pass);
  await clickperc(region, 0.8, 0.65);
  await sleep(1000);
  await clickbattle(region);
}

export async function clickbattle(region: Region) {
  await clickperc(region, 0.5, 0.8);
}

export async function clicknext(region: Region) {
  return await clickperc(region, 0.5, 0.95);
}

export async function waitcolors(
  region: Region,
  x: number,
  y: number,
  colors: string[],
  timeout = Infinity
) {
  const start = Date.now();
  while (true) {
    if (Date.now() - start > timeout) {
      return false;
    }
    await sleep(1000);
    const c = await colorperc(region, x, y);
    console.log(c.toHex());
    if (colors.includes(c.toHex())) {
      return true;
    }
  }
}

export async function colorperc(region: Region, x: number, y: number) {
  console.log(perc(region, x, y));
  return await screen.colorAt(perc(region, x, y));
}

export async function clickperc(region: Region, x: number, y: number) {
  await mouse.move(straightTo(perc(region, x, y)));
  await mouse.leftClick();
}

function perc(region: Region, x: number, y: number) {
  return {
    x: region.left + region.width * x,
    y: region.top + region.height * y,
  };
}
