import './App.css';
import { TonConnectUIProvider, TonConnectButton,useTonAddress,useTonWallet,useTonConnectUI,SendTransactionRequest} from '@tonconnect/ui-react';
import {useEffect, useState} from 'react'
import { createAppKit } from '@reown/appkit/react'
import { KeyPair, mnemonicToPrivateKey, mnemonicToWalletKey } from "ton-crypto";

import { TonConnect } from '@tonconnect/sdk';

import { useConnect, useTransaction, WagmiProvider } from 'wagmi'
import { arbitrum, mainnet,sepolia } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { useAccount,useConfig,useSendTransaction } from "wagmi";
import React, {useMemo } from 'react';
import { ConnectionProvider, WalletProvider,useWallet } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork} from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter, UnsafeBurnerWalletAdapter, WalletConnectWalletAdapter } from '@solana/wallet-adapter-wallets';
import nacl from "tweetnacl";
import bs58 from "bs58";
import { ethers } from 'ethers';
import TonWeb from 'tonweb';

import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton,
    WalletConnectButton
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { Buffer } from "buffer";
import {
  PublicKey,
} from "@solana/web3.js";

import {createMintBody,mintParams,createMintBody2} from "./mintNFT.ts"
import { randomInt } from 'crypto';

const solanaWeb3 = require('@solana/web3.js');
require('@solana/wallet-adapter-react-ui/styles.css');

const queryClient = new QueryClient()
const projectId = '8683af0ba12075372e6ed1c0844e70cb'
const eth_maj = require("ethers")

const DEBELE_ZENE_COLLECTION = "EQAkneVt7fcXEOMsvwBKDLkoKbmQhoqYG-9TV4hABKx2_d6d"
const DEBELE_ZENE_METADATA_HASH = "QmWdWpsZ7Pm4xnKZrpNpLW3by1sC6KCD3EtQdbrXUAQrei"
const tonweb = new TonWeb(
  new TonWeb.HttpProvider('https://testnet.toncenter.com/api/v2/jsonRPC')
);

const Cell = TonWeb.boc.Cell

const metadata = {
  name: 'Geocold',
  description: 'AppKit Example',
  url: 'https://suibex.github.io/TGWallet_FrontEnd', // origin must match your domain & subdomain
  icons: ['https://suibex.github.io/TGWallet_FrontEnd/favicon.ico']
}

export function ConnectTelegramWallet(){

  var loaded_wallet = useTonWallet()
  const [wallet, setWalletAddress] = useState(null); 
  const [tonConnectUI, setOptions] = useTonConnectUI();
  
  useEffect(()=>{

    if(loaded_wallet){
      setWalletAddress(loaded_wallet.account.address);
      document.getElementById("idg").textContent = loaded_wallet.account.address
    }

  },[loaded_wallet]);

  const mint_nft = () => {

    fetch('/getNFTCollectionIdx', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        addr: DEBELE_ZENE_COLLECTION
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
      })
      .then(nftIdx => {

        var params = {
          queryId: 0,
          itemOwnerAddress: loaded_wallet.account.address,
          itemIndex: nftIdx.idx,
          amount: "50000000",
          commonContentUrl: `${DEBELE_ZENE_METADATA_HASH}`,
        }
    
        var body = createMintBody(params)
      
        body.toBoc().then(data=>{
      
          const transaction = {
            validUntil: Math.floor(Date.now() / 1000) + 60,
            network:"-3",
            messages: [
              {
                address: DEBELE_ZENE_COLLECTION, // Destination address
                amount: "50000000", // Amount in nanotons (as string)
                payload: Buffer.from(data).toString("base64")              
              },
            ],
          };
          tonConnectUI
          .sendTransaction(transaction)
          .then((e) => {
            console.log(e);
          })
        })
         
      })
      .catch(error => {
        console.error('Error fetching NFT index:', error);
      });

}
  
  return (
     <div> 
       <TonConnectButton/>
       <br></br>
       <button onClick={mint_nft}>Mint NFT</button>
       <br></br>
       <h1>Balance:</h1>
      </div>
  );

}
 
const networks = [sepolia]; 

const wagmiAdapter = new WagmiAdapter({
    networks,
    projectId,
    ssr: true,
});

const config = wagmiAdapter.wagmiConfig;

const wallkit = createAppKit({
    adapters: [wagmiAdapter],
    networks,
    projectId,
    metadata,
    features: {
        analytics: true,
    },
});


export function WalletConnect({ children }) {
    const [waddr, setwaddr] = useState(null);
    
    const {sendTransaction} = useSendTransaction({
      config:wagmiAdapter.wagmiConfig,
      queryClient:queryClient
    })
      
    const { isConnected, address } = useAccount({
        config,
    });

    useEffect(() => {
        if (isConnected && address) {
            setwaddr(address);
 
            document.getElementById("idg").textContent = address;
        }
    }, [isConnected, address]);
   
    const sendTrans = () => {
    
      const el = document.getElementById("eth_recv_addr").value || "";
      sendTransaction({
          to: el,
          value: eth_maj.parseEther('0.01'),
      })
  };
  
  window.Telegram.WebApp.onEvent("mainButtonClicked",()=>{
    sendTrans()
   })
  
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                {
                
                }
                <w3m-button />
                <br />
               
            </QueryClientProvider>
        </WagmiProvider>
    );
}
const TelegramInit = () => {

  window.Telegram.WebApp.ready();
  window.Telegram.WebApp.MainButton.text = "Send 0.01 ETH"
  window.Telegram.WebApp.MainButton.show()

  const [auth,setAuth] = useState(false)

  useEffect(() => {
    var auth_data = window.Telegram.WebApp.initData
    if(auth_data != ""){
     
      auth_data = new URLSearchParams(decodeURIComponent(auth_data))
      
      var auth_data_dict = {}

      for (const key of auth_data.keys()) {
        console.log(key,auth_data.get(key))
        auth_data_dict[key] = auth_data.get(key)
      }
    
      fetch("/checkAuthentication",{
        method:"POST",
        body:JSON.stringify(auth_data_dict),
        headers:{
          'Content-Type':"application/json"
        }
      }).then((data)=>{
        if(data.status == 200){
          setAuth(true)
        }
      })
    }
  }, []);

  return auth;
};

function App() {
  
  var chat_id = new URL(window.location)  
  const success_auth = TelegramInit()

  const sol_network = WalletAdapterNetwork.Testnet;
  const sol_endpoint = useMemo(() => clusterApiUrl(sol_network), [sol_network]);
  const sol_wallets = useMemo(() => [ new PhantomWalletAdapter({
  })], [sol_network]);
  /*
  return (
    <>
      {success_auth === true ? (
        <TonConnectUIProvider manifestUrl="https://suibex.github.io/TGWallet_FrontEnd/tonconnect-manifest.json">
          <ConnectionProvider endpoint={sol_endpoint}>
            <WalletProvider wallets={sol_wallets}>
              <WalletModalProvider>
              <QueryClientProvider client={queryClient}>
                <div className="App">
                  <header className="App-header">
                    <h1 className="idg" id="idg">-</h1>
                    <input id="eth_recv_addr" type='text' class="wallet-input" placeholder='Address to send ETH to'></input>
                    <br />
                    <ConnectTelegramWallet />
                    <br />
                    <WalletConnect />
                    <br />
                  </header>
                </div>
                </QueryClientProvider>
              </WalletModalProvider>
            </WalletProvider>
          </ConnectionProvider>
        </TonConnectUIProvider>
      ) : (
        <h1>Forbidden</h1>
      )}
    </>
  );
  */
  return (
    <>
      
        <TonConnectUIProvider manifestUrl="https://suibex.github.io/TGWallet_FrontEnd/tonconnect-manifest.json">
          <ConnectionProvider endpoint={sol_endpoint}>
            <WalletProvider wallets={sol_wallets}>
              <WalletModalProvider>
              <QueryClientProvider client={queryClient}>
                <div className="App">
                  <header className="App-header">
                    <h1 className="idg" id="idg">-</h1>
                    <input id="eth_recv_addr" type='text' class="wallet-input" placeholder='Address to send ETH to'></input>
                    <br />
                    <ConnectTelegramWallet />
                    <br />  
                    <WalletConnect/>
                    <br></br>
                 
                  </header>
                </div>
                </QueryClientProvider>
              </WalletModalProvider>
            </WalletProvider>
          </ConnectionProvider>
        </TonConnectUIProvider>
      
    </>
  );
  
  
}



export default App;
