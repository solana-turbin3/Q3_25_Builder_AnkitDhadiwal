import wallet from "../turbin3-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        // Follow this JSON structure
        // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure


        const irysURI = "https://gateway.irys.xyz/E7MzcySC71UkJNE9xKkP1GAEcUWtLHp6yybpaVGYzmaT".replace(
            "https://arwaeve.net/",
            "https://devnet.irys.xyz/"
        );

        console.log("Your Image URI:", irysURI);

        const image = irysURI;
        const metadata = {
            name: "Pineapple Rug NFT",
            symbol: "PAL",
            description: "This is the rug day nft !",
            image: image,
            attributes: [
                {trait_type: 'unique', value: '1'}
            ],
            properties: {
                files: [
                    {
                        type: "image/png",
                        uri: "image"
                    },
                ]
            },
            creators: []
        };
        const myUri = await umi.uploader.uploadJson(metadata);
        console.log("Your metadata URI: ", myUri);
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();

//Your Image URI: https://gateway.irys.xyz/7pyWpLDwdZtv259z6qwGFqkFGJRkfNuNAUMxQJfTjKLm
//Your metadata URI:  https://gateway.irys.xyz/4z45R41Ampj1rAXyzAqdW516wqcA2Sf7MGRJBpvxzLCt

//BGS
// Your Image URI: https://gateway.irys.xyz/EWpvabPTkA3xMuaFws9jeJTphvB6TA39sw8vL2qF9QpY
// Your metadata URI:  https://gateway.irys.xyz/Au1c5wh787R6AU7Fg3tTMwx8eXbmi2PkLwajJ3GBBPMi