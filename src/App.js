/* global __DEV__ */

import './App.css';
import { TonConnectUIProvider, TonConnectButton,useTonAddress,useTonWallet} from '@tonconnect/ui-react';
import {useEffect, useState} from 'react'
import { createAppKit } from '@reown/appkit/react'

import { useConnect, WagmiProvider } from 'wagmi'
import { arbitrum, mainnet } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { useAccount,useConfig } from "wagmi";
import { CustomConnector } from './CustomConnector';
import React, {useMemo } from 'react';
import { ConnectionProvider, WalletProvider,useWallet } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork} from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter, UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';

import nacl from "tweetnacl";
import bs58 from "bs58";
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

const solanaWeb3 = require('@solana/web3.js');

require('@solana/wallet-adapter-react-ui/styles.css');

const queryClient = new QueryClient()

const projectId = '8683af0ba12075372e6ed1c0844e70cb'

const metadata = {
  name: 'Geocold',
  description: 'AppKit Example',
  url: 'https://suibex.github.io/TGWallet_FrontEnd', // origin must match your domain & subdomain
  icons: ['https://suibex.github.io/TGWallet_FrontEnd/favicon.ico']
}

const networks = [mainnet, arbitrum]


const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true
});

const config = wagmiAdapter.wagmiConfig

const wallkit = createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true // Optional - defaults to your Cloud configuration
  }
})

export const SolanaWallet = () => {
  const { publicKey, connect, disconnect, connected } = useWallet();

  // Log the wallet public key and connection state whenever they change
  useEffect(() => {
    if (connected && publicKey) {
      document.getElementById("idg").textContent = publicKey.toBase58();
    } 
  }, [connected, publicKey]);

  return (
    <div>
      <WalletMultiButton></WalletMultiButton>

    </div>
  );
};


export function WalletConnect({children}){
  const [waddr,setwaddr] = useState(null);

  const isConnected = useAccount({
    config,
  })
  console.log("is CONNECTED? ",isConnected)
  if(isConnected && isConnected.address){
    document.getElementById("idg").textContent = isConnected.address;
  }
  useEffect(()=>{
    if(isConnected){
      setwaddr(wallkit.getAddress())
      console.log("ADDR:",isConnected.address)
      document.getElementById("idg").textContent = isConnected.address;

    }
  },[isConnected])
  
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig} use>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    <w3m-button />
  </WagmiProvider>
)
}

export function ConnectTelegramWallet(){

  const wallet = useTonWallet();   
  const [walletAddress, setWalletAddress] = useState(null); 

  useEffect(()=>{
    if(wallet){
      setWalletAddress(wallet.account.address);
      document.getElementById("idg").textContent = wallet.account.address;
    } else {
     
    }
  },[wallet]);
  console.log(wallet)


  
  return (
     <div> 
       <TonConnectButton/>
      </div>
  );

}
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}


function App() {

  const sol_network = WalletAdapterNetwork.Testnet;
  const sol_endpoint = useMemo(() => clusterApiUrl(sol_network), [sol_network]);
  const sol_wallets = useMemo(() => [ new PhantomWalletAdapter({
  })], [sol_network]);

  var sol_cookie = undefined

  try{
      
    sol_cookie = getCookie("phantominfo")
    sol_cookie = JSON.parse(sol_cookie)
    sol_cookie = sol_cookie['public_key']

  }catch(e){
    console.log(e)
  }


  return (
    
    <TonConnectUIProvider manifestUrl="https://suibex.github.io/TGWallet_FrontEnd/tonconnect-manifest.json">
      <ConnectionProvider endpoint={sol_endpoint}>
      <WalletProvider wallets={sol_wallets} >
        <WalletModalProvider>
            <div className="App">
           
              <header className="App-header">
              <p class="idg" id="idg"></p>
              {
                sol_cookie != undefined ? (
                  <p id="idg">{sol_cookie}</p>
                ):(
                  <p id="idg"> </p>  
                )
              }
              <ConnectTelegramWallet/>
              <br></br>
              <WalletConnect/>
              <br></br>
              <SolanaWallet/>
              <br></br>
              <CustomConnector/>
              </header>

            
            </div>
          
        </WalletModalProvider>
      </WalletProvider>
      </ConnectionProvider>
      </TonConnectUIProvider>
  );
  
}



export default App;
