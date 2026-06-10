#!/usr/bin/env node
// Signs vouchers using the exact hash the contract expects.
// Run after prepare, with .env (SIGNER_PRIVATE_KEY, CONTRACT_ADDRESS, CHAIN_ID, ASSET_BASE).

import fs from "fs";
import path from "path";
import { ethers } from "ethers"; // after npm install

const PRIVATE_KEY = process.env.SIGNER_PRIVATE_KEY;
const CONTRACT = process.env.CONTRACT_ADDRESS;
const CHAIN_ID = BigInt(process.env.CHAIN_ID || "84532");
const METADATA_DIR = path.resolve("samples/metadata");

if (!PRIVATE_KEY || !CONTRACT) {
  console.error("Missing SIGNER_PRIVATE_KEY or CONTRACT_ADDRESS in env. Using demo mode (insecure placeholders).");
}

const wallet = PRIVATE_KEY ? new ethers.Wallet(PRIVATE_KEY) : null;

async function main() {
  const files = fs.readdirSync(METADATA_DIR).filter(f => f.endsWith(".json")).sort();
  const vouchers = [];

  for (const f of files) {
    const data = JSON.parse(fs.readFileSync(path.join(METADATA_DIR, f), "utf8"));
    const tokenId = parseInt(f.replace(".json",""), 10);
    const tokenURI = data.token_uri || data.image;

    let signature = "0x" + "00".repeat(65); // placeholder

    if (wallet && CONTRACT) {
      const packed = ethers.solidityPacked(
        ["address", "uint256", "uint256", "string"],
        [CONTRACT, CHAIN_ID, tokenId, tokenURI]
      );
      const hash = ethers.keccak256(packed);
      signature = await wallet.signMessage(ethers.getBytes(hash));
    }

    vouchers.push({
      tokenId,
      tokenURI,
      signature,
      name: data.name,
      fortune: data.attributes?.find(a => a.trait_type === "Fortune")?.value || ""
    });
    console.log(`Signed #${tokenId}`);
  }

  fs.writeFileSync("signed-vouchers.json", JSON.stringify(vouchers, null, 2));
  console.log(`Wrote signed-vouchers.json (${vouchers.length} items)`);
}

main().catch(e => { console.error(e); process.exit(1); });