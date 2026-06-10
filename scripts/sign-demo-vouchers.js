#!/usr/bin/env node
// Demo signer — produces *invalid* signatures for UI testing only.
// Run: node scripts/sign-demo-vouchers.js

import fs from "fs";
import path from "path";

const METADATA_DIR = path.resolve("samples/metadata");
const CONTRACT = "0x0000000000000000000000000000000000000000"; // will be replaced in real flow
const CHAIN_ID = 84532;

const files = fs.readdirSync(METADATA_DIR).filter(f => f.endsWith(".json")).sort();
const vouchers = [];

for (const f of files) {
  const data = JSON.parse(fs.readFileSync(path.join(METADATA_DIR, f), "utf8"));
  const tokenId = parseInt(f.replace(".json",""), 10);
  const tokenURI = data.token_uri || data.image;

  // Dummy 65-byte sig (will fail on-chain until real sign)
  const signature = "0x" + Array.from({length:65}, () => "ab").join("").slice(0,130);

  vouchers.push({
    tokenId,
    tokenURI,
    signature,
    name: data.name,
    fortune: data.attributes?.find(a => a.trait_type === "Fortune")?.value || ""
  });
}

fs.writeFileSync("signed-vouchers.json", JSON.stringify(vouchers, null, 2));
console.log(`Demo signed-vouchers.json written with ${vouchers.length} entries (UI test only — replace with real sign before launch).`);