import { Connection, Keypair, PublicKey, SystemProgram } from "@solana/web3.js"
import { Program, Wallet, AnchorProvider } from "@coral-xyz/anchor"
import { IDL, Turbin3Prereq } from "./programs/Turbin3_prereq";
import wallet from "./Turbin3-wallet.json"

const MPL_CORE_PROGRAM_ID = new PublicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");

// Import keypair from wallet (the missing code they mentioned)
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

// Create devnet connection (another "forgotten" piece)
const connection = new Connection("https://api.devnet.solana.com");

// Create our anchor provider
const provider = new AnchorProvider(connection, new Wallet(keypair), {
    commitment: "confirmed"
});

// Create our program
const program: Program<Turbin3Prereq> = new Program(IDL, provider);

// Mint collection address
const mintCollection = new PublicKey("5ebsp5RChCGK7ssRZMVMufgVZhd2kFbNaotcZ5UvytN2");

// Generate mint account for new asset
const mintTs = Keypair.generate();

// Create the PDA for our enrollment account
const account_seeds = [
    Buffer.from("prereqs"),
    keypair.publicKey.toBuffer(),
];
const [account_key, _account_bump] = PublicKey.findProgramAddressSync(account_seeds, program.programId);

// MISSING PIECE: Create PDA for authority (hint they gave about missing account)
// ✅ Correct PDA for authority based on IDL seed: ["collection", collection pubkey]
const [authority_key] = PublicKey.findProgramAddressSync(
  [Buffer.from("collection"), mintCollection.toBuffer()],
  program.programId
);


// Execute the initialize transaction
async function initialize() {
    try {
        const txhash = await program.methods
            .initialize("ankitdhadiwal") // Replace with YOUR actual GitHub username
            .accountsPartial({
                user: keypair.publicKey,
                account: account_key,
                systemProgram: SystemProgram.programId, // Fixed: was system_program
            })
            .signers([keypair])
            .rpc();
        console.log(`Success! Check out your TX here: https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
    } catch (e) {
        console.error(`Oops, something went wrong: ${e}`);
    }
}

// Execute the submitTs transaction
async function submitTs() {
    try {
        const txhash = await program.methods
            .submitTs()
            .accountsPartial({
                user: keypair.publicKey,
                account: account_key,
                mint: mintTs.publicKey,
                collection: mintCollection,
                authority: authority_key, // The missing account they hinted at
                mplCoreProgram: MPL_CORE_PROGRAM_ID, // Fixed: was mpl_core_program
                systemProgram: SystemProgram.programId, // Fixed: was system_program
            })
            .signers([keypair, mintTs])
            .rpc();
        console.log(`Success! Check out your TX here: https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
    } catch (e) {
        console.error(`Oops, something went wrong: ${e}`);
    }
}

// Run initialize first, then comment it out and run submitTs
//initialize();
submitTs(); // Uncomment this after initialize succeeds