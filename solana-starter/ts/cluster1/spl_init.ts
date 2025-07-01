import { Keypair, Connection, Commitment } from "@solana/web3.js";
import { createMint } from '@solana/spl-token';
import wallet from "../turbin3-wallet.json"

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

(async () => {
    try {
        // Start here
        const mint = await createMint(connection, keypair, keypair.publicKey, null, 6);
        console.log(`Mint Address: ${mint.toBase58()}`);
    } catch(error) {
        console.log(`Oops, something went wrong: ${error}`)
    }
})()


// Mint Address : Dn6j5RkQ3ZgQrPQPYQub2Tq6N6m7NL9epb8jqb8eUzKU
//https://turbine-solanad-4cde.devnet.rpcpool.com/9a9da9cf-6db1-47dc-839a-55aca5c9c80a