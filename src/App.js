import './App.css';
import { TonConnectUIProvider, TonConnectButton,useTonAddress,useTonWallet} from '@tonconnect/ui-react';
import {useEffect, useState} from 'react'
import { createAppKit } from '@reown/appkit/react'

import { useConnect, WagmiProvider } from 'wagmi'
import { arbitrum, mainnet } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { useAccount,useConfig } from "wagmi";


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


export function WalletConnect({children}){
  const [waddr,setwaddr] = useState(null);

  const isConnected = useAccount({
    config,
  })
  console.log("CONNECTED:",isConnected)
  if(isConnected && isConnected.address){
    document.getElementById("idg").textContent = isConnected.address;
  }
  useEffect(()=>{
    if(isConnected){
      setwaddr(wallkit.getAddress())
      console.log("ADDR:",isConnected.address)

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


function App() {


  return (
    <TonConnectUIProvider manifestUrl="https://suibex.github.io/TGWallet_FrontEnd/tonconnect-manifest.json">
 
    <div className="App">
      <header className="App-header">
      <p class="idg" id="idg">-</p> 
      <ConnectTelegramWallet/>
      <br></br>
      <WalletConnect/>
      </header>
    
    </div>
    </TonConnectUIProvider>
  );
  
}



export default App;