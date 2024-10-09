import './App.css';
import { TonConnectUIProvider, TonConnectButton,useTonAddress,useTonWallet} from '@tonconnect/ui-react';
import {useEffect, useState} from 'react'

export function WalletConnectStuff(){
  const wallet = useTonWallet();   
  const [walletAddress, setWalletAddress] = useState(null); 

  useEffect(()=>{
    if(wallet){
      console.log("Wallet Connected:", wallet);
      setWalletAddress(wallet.account.address);
    } else {
      console.log("No wallet found");
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

      <WalletConnectStuff/>
      <br></br>
      <button class="zmaj">Connect To MetaMask</button>

      </header>
    
    </div>
    </TonConnectUIProvider>
  );
  
}



export default App;
