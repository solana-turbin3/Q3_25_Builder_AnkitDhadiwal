import bs58 from "bs58";
import promptSync from "prompt-sync";
import * as fs from "fs";

const prompt = promptSync();
const base58 = prompt("Enter your Phantom private key (base58): ");
const secretKey = bs58.decode(base58);
console.log("✅ Decoded Keypair:", Array.from(secretKey));

// Optionally write to a file
fs.writeFileSync("Turbin3-wallet.json", JSON.stringify(Array.from(secretKey)));
console.log("✅ Saved to Turbin3-wallet.json");
