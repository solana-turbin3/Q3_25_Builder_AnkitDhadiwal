import { Keypair, PublicKey, Connection, Commitment } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import wallet from "../turbin3-wallet.json"

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

const token_decimals = 1_000_000n;

// Mint address
const mint = new PublicKey("F8uuLx45WEvkj6b3ScQqhh4xiFYgPr7AbhW6Df6XbAjn");

(async () => {
    try {
        // Create an ATA
        const ata = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, keypair.publicKey);
        console.log(`Your ata is: ${ata.address.toBase58()}`);

        // Mint to ATA
        const mintTx = await mintTo(connection, keypair, mint, ata.address, keypair.publicKey, token_decimals);
        console.log(`Your mint txid: ${mintTx}`);
    } catch(error) {
        console.log(`Oops, something went wrong: ${error}`)
    }
})()


// ATA : 9WpigzZC9uDJ8WGprk4bXAmTnyi3QhyyL9DBKoAtakhJ
// Mint txid: 33kD2X7DLnYEdb7f9LdKu7GZTvSTC8dZuY6VQbCGfbDBmZavSACaGvuTDiGHovkoQ1ge6d5tXsLwv6GtzkGY5KUj
// Mint address : F8uuLx45WEvkj6b3ScQqhh4xiFYgPr7AbhW6Df6XbAjn