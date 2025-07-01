#[cfg(test)]
mod tests {
    use std::io::{self, BufRead};
    use bs58;
    use solana_client::rpc_client::RpcClient;
    use solana_sdk::signature::{Keypair, Signer, read_keypair_file};
    use solana_program::{pubkey::Pubkey, system_instruction::transfer};
    use solana_sdk::message::Message;
    use std::str::FromStr;
    use solana_sdk::{instruction::{AccountMeta, Instruction}, transaction::Transaction};


    //const RPC_URL: &str = "https://turbine-solanad-4cde.devnet.rpcpool.com/9a9da9cf-6db1-47dc-839a-55aca5c9c80a";
    const RPC_URL: &str = "https://api.devnet.solana.com";



    #[test]
    fn keygen() {
        let kp = Keypair::new();
        println!("You've generated a new Solana wallet: {}", kp.pubkey());
        println!("\nSave your private key JSON array:");
        println!("{:?}", kp.to_bytes());
    }


    #[test]
    fn base58_to_wallet() {
        println!("Paste Base58 key:");
        let stdin = io::stdin();
        let base58 = stdin.lock().lines().next().unwrap().unwrap();
        let wallet = bs58::decode(base58).into_vec().unwrap();
        println!("{:?}", wallet);
    }

    #[test]
    fn wallet_to_base58() {
        println!("Paste JSON array key:");
        let stdin = io::stdin();
        let wallet = stdin.lock().lines().next().unwrap().unwrap();
        let wallet: Vec<u8> = wallet
            .trim_matches(|c| c == '[' || c == ']')
            .split(',')
            .map(|x| x.trim().parse().unwrap())
            .collect();
        println!("{}", bs58::encode(wallet).into_string());
    }


    #[test]
    fn airdrop() {
        let keypair = read_keypair_file("dev-wallet.json").expect("Couldn't load wallet");
        let client = RpcClient::new(RPC_URL);

        let result = client.request_airdrop(&keypair.pubkey(), 2_000_000_000);
        match result {
            Ok(sig) => println!("Success: https://explorer.solana.com/tx/{}?cluster=devnet", sig),
            Err(e) => println!("Airdrop failed: {}", e),
        }
    }

    #[test]
    fn check_balance() {
        let keypair = read_keypair_file("dev-wallet.json").expect("Couldn't load wallet");
        let client = RpcClient::new(RPC_URL);
        let balance = client.get_balance(&keypair.pubkey()).unwrap();
        println!("💰 Current balance: {} SOL", balance as f64 / 1_000_000_000.0);
    }

    
    #[test]
    fn transfer_sol() {
        let keypair = read_keypair_file("dev-wallet.json").expect("Couldn't load wallet");
        let client = RpcClient::new(RPC_URL);
        let to_pubkey = Pubkey::from_str("HWU5EhdNTd9pw8PQoapFg5jnCxk8NPDcXYsxpQvEcAen").unwrap();
        let blockhash = client.get_latest_blockhash().unwrap();

        let tx = Transaction::new_signed_with_payer(
            &[transfer(&keypair.pubkey(), &to_pubkey, 1_000_000)],
            Some(&keypair.pubkey()),
            &[&keypair],
            blockhash,
        );

        let sig = client.send_and_confirm_transaction(&tx).expect("Failed TX");
        println!("Transfer Success: https://explorer.solana.com/tx/{}/?cluster=devnet", sig);
    }


        
    #[test]
    fn empty_wallet() {
        let keypair = read_keypair_file("dev-wallet.json").unwrap();
        let client = RpcClient::new(RPC_URL);
        let to_pubkey = Pubkey::from_str("HWU5EhdNTd9pw8PQoapFg5jnCxk8NPDcXYsxpQvEcAen").unwrap();
        let blockhash = client.get_latest_blockhash().unwrap();

        let balance = client.get_balance(&keypair.pubkey()).unwrap();

        let message = Message::new_with_blockhash(
            &[transfer(&keypair.pubkey(), &to_pubkey, balance)],
            Some(&keypair.pubkey()),
            &blockhash,
        );

        let fee = client.get_fee_for_message(&message).unwrap();

        let tx = Transaction::new_signed_with_payer(
            &[transfer(&keypair.pubkey(), &to_pubkey, balance - fee)],
            Some(&keypair.pubkey()),
            &[&keypair],
            blockhash,
        );

        let sig = client.send_and_confirm_transaction(&tx).unwrap();
        println!("All SOL transferred: https://explorer.solana.com/tx/{}/?cluster=devnet", sig);
    }

    #[test]
    fn submit_completion() {
        let client = RpcClient::new(RPC_URL);
        let signer = read_keypair_file("dev-wallet.json").unwrap();
        let signer_pubkey = signer.pubkey();

        let turbin3_program = Pubkey::from_str("TRBZyQHB3m68FGeVsqTK39Wm4xejadjVhP5MAZaKWDM").unwrap();
        let collection = Pubkey::from_str("5ebsp5RChCGK7ssRZMVMufgVZhd2kFbNaotcZ5UvytN2").unwrap();
        let mpl_core_program = Pubkey::from_str("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d").unwrap();
        let system_program = solana_sdk::system_program::id();

        let (pda, _bump) = Pubkey::find_program_address(&[b"prereqs", signer_pubkey.as_ref()], &turbin3_program);

        let mint = Keypair::new();
        let authority = Pubkey::from_str("5xstXUdRJKxRrqbJuo5SAfKf68y7afoYwTeH1FXbsA3k").unwrap();

        let accounts = vec![
            AccountMeta::new(signer_pubkey, true),
            AccountMeta::new(pda, false),
            AccountMeta::new(mint.pubkey(), true),
            AccountMeta::new(collection, false),
            AccountMeta::new_readonly(authority, false),
            AccountMeta::new_readonly(mpl_core_program, false),
            AccountMeta::new_readonly(system_program, false),
        ];

        let data = vec![77, 124, 82, 163, 21, 133, 181, 206];

        let ix = Instruction {
            program_id: turbin3_program,
            accounts,
            data,
        };

        let blockhash = client.get_latest_blockhash().unwrap();

        let tx = Transaction::new_signed_with_payer(
            &[ix],
            Some(&signer_pubkey),
            &[&signer, &mint],
            blockhash,
        );

        let sig = client.send_and_confirm_transaction(&tx).unwrap();
        println!("✅ Proof submitted: https://explorer.solana.com/tx/{}/?cluster=devnet", sig);
    }

    #[test]
    fn check_pda_exists() {
        const RPC_URL: &str = "https://api.devnet.solana.com";
        let client = RpcClient::new(RPC_URL);
        let signer = read_keypair_file("dev-wallet.json").unwrap();
        let signer_pubkey = signer.pubkey();

        let program_id = Pubkey::from_str("TRBZyQHB3m68FGeVsqTK39Wm4xejadjVhP5MAZaKWDM").unwrap();
        let (pda, _) = Pubkey::find_program_address(&[b"prereqs", signer_pubkey.as_ref()], &program_id);

        match client.get_account(&pda) {
            Ok(account) => println!("✅ PDA found with {} lamports", account.lamports),
            Err(e) => println!("❌ PDA not found: {}", e),
        }
    }

}

