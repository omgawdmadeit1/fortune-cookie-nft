# fortune-cookie-launcher (custom skill example)

**Current live (shareable bypass for protected preview):**  
https://omg-dsvbhnrav-josephlamartaylor-9087s-projects.vercel.app/?_vercel_share=rhtR4R5An8BNSm1K6EErc0jODK8xnDAG

This bundles the full "prepare → sign → deploy contract → update frontend → claim Vercel → verify" flow for the Crypto Fortune Cookie NFT (10-edition, Base, gas-only voucher redeem).

**Status (post verification-before-completion):** Not yet fully public/ready (protection + missing real scripts in some contexts + need to push the redesigned HTMLs + run real deploy/sign with keys). Files in this dir are the complete package. Use the share link for immediate collector preview of the simple version; deploy the local redesigned HTMLs for the premium experience.

## Quick start (user side)
1. cd into this folder
2. npm install
3. node scripts/prepare-assets.js https://YOUR_PUBLIC_URL
4. (Copy .env.example to .env and fill keys)
5. npx hardhat run scripts/deploy.ts --network baseSepolia
6. node scripts/sign-vouchers.js   (or sign:demo for UI test)
7. Update any CONTRACT in the HTMLs if using the simple pages
8. npx vercel --prod   (or use MCP deploy_to_vercel / vercel-cli-with-tokens)
9. Claim in dashboard, disable protection for the project/deployment
10. Test with webapp-testing + verification-before-completion gate
11. Announce the clean public URL + contract on Basescan

See the review report and brainstorming plan (in conversation history) for the no-corners checklist.

## Usage (once turned into a real Grok skill or script)

1. `npm run prepare -- --base https://your-live-url.vercel.app`
2. Set .env with DEPLOYER and SIGNER keys + RPCs + BASESCAN key.
3. `npm run deploy:sepolia`
4. `npx hardhat verify --network baseSepolia <addr> <signer>`
5. Update mint-page.html CONTRACT and ASSET_BASE (or use build step).
6. `npm run sign`
7. `npx vercel --prod` (or the MCP / CLI skill)
8. Test full flow with webapp-testing + verification-before-completion.
9. Promote / claim in dashboard, disable protection for public.

See the files in this dir + the review and brainstorming outputs for the exact checklist.

This skill would wrap the above + the share-link generation + dashboard instructions + safety prompts ("are you on testnet first?") into a guided one-command experience.

Created as part of using create-skill / skill-creator patterns.