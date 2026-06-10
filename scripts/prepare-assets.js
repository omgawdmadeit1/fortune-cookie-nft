#!/usr/bin/env node
// Simple prepare for demo / launch. Sets ASSET_BASE and generates placeholder metadata + a skeleton for signing.
// Usage: node scripts/prepare-assets.js https://your-live.vercel.app

import fs from "fs";
import path from "path";

const outDir = path.resolve("samples");
fs.mkdirSync(path.join(outDir, "metadata"), { recursive: true });

const base = process.argv[2] || process.env.ASSET_BASE || "https://YOUR_ASSET_BASE_HERE";

const fortunes = [
  "The chain does not forget those who build in silence.",
  "Your next moonshot is already in your possession.",
  "Destiny is onchain. Your part is to inscribe it.",
  "The ancestors sealed this for the one who waited.",
  "Bear market survivors get the richest rewards.",
  "You did not find this cookie. It found you.",
  "HODL the line — the halving is your ally.",
  "Warning: Extreme FOMO detected. Proceed with conviction.",
  "The vault opens only for those who knock with conviction.",
  "Fortune favors the bold... and the early adopters on Base."
];

for (let i = 1; i <= 10; i++) {
  const id = String(i).padStart(4, "0");
  const meta = {
    name: `Crypto Fortune Cookie #${id}`,
    description: "Crack open. Receive prophecy. On-chain destiny on Base.",
    image: `${base}/samples/images/cookie_${id}.png`,
    token_uri: `${base}/samples/metadata/${id}.json`,
    attributes: [
      { trait_type: "Fortune", value: fortunes[i-1] },
      { trait_type: "Edition", value: "1 of 10" },
      { trait_type: "Chain", value: "Base" }
    ]
  };
  fs.writeFileSync(path.join(outDir, "metadata", `${id}.json`), JSON.stringify(meta, null, 2));
  console.log(`Prepared ${id}.json`);
}

console.log(`\nPrepared with base: ${base}`);
console.log("Run sign next with real CONTRACT and SIGNER key (or sign:demo).");