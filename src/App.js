import './App.css';
import { TonConnectUIProvider, TonConnectButton,useTonAddress,useTonWallet} from '@tonconnect/ui-react';
import {useEffect, useState} from 'react'
import { createAppKit } from '@reown/appkit/react'

import { WagmiProvider } from 'wagmi'
import { arbitrum, mainnet } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

const queryClient = new QueryClient()

const projectId = '8683af0ba12075372e6ed1c0844e70cb'

const metadata = {
  name: 'Geocold',
  description: 'AppKit Example',
  url: 'https://suibex.github.io/TGWallet_FrontEnd', // origin must match your domain & subdomain
  icons: ['https://suibex.github.io/TGWallet_FrontEnd/favicon.ico']
}

const networks = [mainnet, arbitrum]

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true // Optional - defaults to your Cloud configuration
  }
})


const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true
});

export function WalletConnect({children}){
  /*
  return (
    <div>
      <button class="zmaj">Connect To MetaMask</button>
    </div>
  )
    */return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </WagmiProvider>
)
}

export function ConnectTelegramWallet(){
  const wallet = useTonWallet();   
  const [walletAddress, setWalletAddress] = useState(null); 

  useEffect(()=>{
    if(wallet){
      
      setWalletAddress(wallet.account.address);
    } else {
     
    }
  },[wallet]);
  console.log(wallet)
  
  return (
     <div> 
    
      {wallet ? (
  <div>
  <p> Wallet Address: {walletAddress}</p>
</div>
      ) : (
        <div>
        <p> - </p>
      </div>
      )}
       <TonConnectButton/>
      </div>
  );

}


function App() {


  return (
    <TonConnectUIProvider manifestUrl="https://suibex.github.io/TGWallet_FrontEnd/tonconnect-manifest.json">
 
    <div className="App">
      <header className="App-header">
      
      <ConnectTelegramWallet/>
      <br></br>
      <WalletConnect/>
      </header>
    
    </div>
    </TonConnectUIProvider>
  );
  
}



export default App;
