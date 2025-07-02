import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createSignerFromKeypair, signerIdentity, generateSigner, percentAmount } from "@metaplex-foundation/umi"
import { createNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";

import wallet from "../turbin3-wallet.json"
import base58 from "bs58";

const RPC_ENDPOINT = "https://api.devnet.solana.com";
const umi = createUmi(RPC_ENDPOINT);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));
umi.use(mplTokenMetadata())

const mint = generateSigner(umi);

(async () => {
    let tx = createNft(umi, {
        mint,
        name: "Bharti General Store",
        symbol: "BGS",
        uri: "https://gateway.irys.xyz/Au1c5wh787R6AU7Fg3tTMwx8eXbmi2PkLwajJ3GBBPMi",
        sellerFeeBasisPoints: percentAmount(5)
    });
    let result = await tx.sendAndConfirm(umi);
    const signature = base58.encode(result.signature);
    
    console.log(`Succesfully Minted! Check out your TX here:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`)

    console.log("Mint Address: ", mint.publicKey);
})();


//https://explorer.solana.com/tx/4Q4ZwSzMe1rnYvtthZT6mWyJoskfYRtXsMybjgYwER6r1T8akUVvfcVxC3xGw7JP8NLnbKbvG2ziifyd5SWNntPf?cluster=devnet
//Mint Address:  BdWGv8crV38YaNjTTTKWGRJPcCUY55xuhF8eHhKQyGJJ

//BGS
//https://explorer.solana.com/tx/3XFKgEitMPgnaivbNGH4u6gPZFLoKgLvtxgFrfBytFrnVLrHW5Nbm9EWjHRRKAc6kLP9kxaxEn81JHuxTxQN6ybx?cluster=devnet
//Mint Address:  avRp1E4AyHe4A44Q66KbxHCE3DCDrcGXDbxJunwrEdW
