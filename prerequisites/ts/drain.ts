import {
  Transaction,
  SystemProgram,
  Connection,
  Keypair,
  sendAndConfirmTransaction,
  PublicKey,
} from "@solana/web3.js";
import wallet from "./dev-wallet.json";

const from = Keypair.fromSecretKey(new Uint8Array(wallet));
const to = new PublicKey("87eaezi5Nou5d5MFH2DStENzWZ6iHNroDHZSbSca4RDu");
const connection = new Connection("https://api.devnet.solana.com");

(async () => {
  try {
    const balance = await connection.getBalance(from.publicKey);

    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: to,
        lamports: balance, // Temporarily using full balance to calculate fee
      })
    );
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    tx.feePayer = from.publicKey;

    const fee = (await connection.getFeeForMessage(tx.compileMessage(), 'confirmed')).value || 0;

    // Remove old transfer, replace with actual correct lamports (balance - fee)
    tx.instructions.pop();
    tx.add(
      SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: to,
        lamports: balance - fee - 500000,
      })
    );

    const sig = await sendAndConfirmTransaction(connection, tx, [from]);
    console.log(`✅ Drained dev wallet: https://explorer.solana.com/tx/${sig}?cluster=devnet`);
  } catch (e) {
    console.error("❌ Drain failed:", e);
  }
})();
