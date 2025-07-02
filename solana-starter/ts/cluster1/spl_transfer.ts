import { Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import wallet from "../turbin3-wallet.json"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("GumGYJqy1bixo3W1S67UdVcxzbWRMoUTAWfY42sdjSmM");

// Recipient address
const to = new PublicKey("9ivkpfHaFo9jb3ihWRHw6NsFrbCkuAy2JRsCfRg3i22");

(async () => {
    try {
        // Get the token account of the fromWallet address, and if it does not exist, create it
        const ata_sender = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            keypair.publicKey
        )
        console.log(`Sender ata is : ${ata_sender.address.toBase58()}`);


        // Get the token account of the toWallet address, and if it does not exist, create it
          const ata_receiver = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            to
        )
        console.log(`Receiver ata is : ${ata_receiver.address.toBase58()}`);

        // Transfer the new token to the "toTokenAccount" we just created
        const tx = await transfer(
            connection,
            keypair,
            ata_sender.address,
            ata_receiver.address,
            keypair,
            1e6
        )
        console.log(`Transfer Successfull : ${tx}`);
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();