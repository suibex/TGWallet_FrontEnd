/* global __DEV__ */
import { TonConnectUIProvider, TonConnectButton,useTonAddress,useTonWallet} from '@tonconnect/ui-react';
import {useEffect, useState} from 'react'
import { createAppKit } from '@reown/appkit/react'
import { useConnect, WagmiProvider } from 'wagmi'
import { arbitrum, mainnet } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { useAccount,useConfig } from "wagmi";

import React, {useMemo,ReactDOM } from 'react';
import { ConnectionProvider, WalletProvider,useWallet } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork} from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter, UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';

import nacl from "tweetnacl";
import bs58, { decode } from "bs58";
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
const util = require('tweetnacl-util');
const { decodeUTF8, encodeBase64, decodeBase64, encodeUTF8 } = require('tweetnacl-util');


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

export const CustomConnector = () =>{
  
  

    const seedString = '8afae8729b48d24f94c6d6db41748bda3c62d6882f3d5b7d5f9c86e638b9a89f'
    const seed = util.decodeUTF8(seedString);

    // Ensure the seed is exactly 32 bytes
    const seed32Bytes = seed.slice(0, 32);  // Truncate if it's longer

    // Step 2: Generate the key pair from the seed
    const keypair = nacl.box.keyPair.fromSecretKey(seed32Bytes);
    
    const sol_network = WalletAdapterNetwork.Devnet;
    const sol_endpoint = useMemo(() => clusterApiUrl(sol_network), [sol_network]);
    
    const [PWPublicKey, setPWPublicKey] = useState("");
    const [PWSession, setPWSession] = useState("");
    const [session_nonce,setNonce] = useState("");
    const [sharedSecret,setSharedSecret] = useState("")



    useEffect(()=>{ 
        var url = new URL(window.location)
        var params = url.searchParams
      
  
        if (/onPhantomDisconnect/.test(url.pathname)) {
          setPWPublicKey(null);
          console.log("disconnected");
          window.location.href="/"
        }
      
        if(/onPhantomConnect/.test(url.pathname)){
          var raw_req = new URL(url).searchParams
          
          const sharedSecretDapp = nacl.box.before(
            bs58.decode(params.get("phantom_encryption_public_key")),
            keypair.secretKey
          );
         
          //decrypt json 
          const decrypted_msg = nacl.box.open.after(
            bs58.decode(raw_req.get("data")),
            bs58.decode(raw_req.get("nonce")),
            sharedSecretDapp
          )
        
          //send result to logger server
          fetch("/log",{
            method:"POST",
            body:JSON.stringify({
              "data":decrypted_msg,
            }),
            headers:{
              "Content-Type":"application/json"
            }
          })
          .then((res) => res.json())

          if(decrypted_msg){
         
            var decoded_data = JSON.parse(new TextDecoder().decode(decrypted_msg))
            
            setPWPublicKey(decoded_data['public_key'])
            setPWSession(decoded_data['session'])
            setNonce(raw_req.get("nonce"))
            setSharedSecret(sharedSecretDapp)
            
           // document.getElementById("idg").textContent = decoded_data['public_key']
            
            document.cookie = `phantominfo=${JSON.stringify(
              {
                "session":decoded_data['session'],
                "public_key":decoded_data['public_key'],
                "secret":sharedSecretDapp
              }
            )};`
            window.location.href="/"
          }
          
        }
    },[])  

    const disconnect = () =>{
      
      var sol_cookie = getCookie("phantominfo")
      sol_cookie = JSON.parse(sol_cookie)
   
      setPWSession(sol_cookie['session'])
      setPWPublicKey(sol_cookie['public_key'].toString())
      console.log("SECRET:",sol_cookie['secret'])
      document.cookie="phantominfo=;"
 
      var shscr = new Uint8Array(Object.values(sol_cookie['secret']));
    
      const nonce = nacl.randomBytes(nacl.box.nonceLength);
      
      console.log("TYPE:",shscr,nonce,  Buffer.from(JSON.stringify({
        'session':PWSession
      })))
      
      var encr_json = nacl.box.after(
        Buffer.from(JSON.stringify({
          'session':PWSession
        })),
        nonce,
        shscr
      );
      
   
      

      const params = new URLSearchParams({
        dapp_encryption_public_key: bs58.encode(keypair.publicKey),
        nonce:  bs58.encode(nonce),
        redirect_link: "https://suibex.github.io/onPhantomDisconnect",
        payload:bs58.encode(encr_json)
      });
    
      const url = `https://phantom.app/ul/v1/disconnect?${params.toString()}`;
  
      window.location.href = url
      
    }

    const connect = ()=>{
      const params = new URLSearchParams({
        dapp_encryption_public_key: bs58.encode(keypair.publicKey),
        cluster: sol_network,
        app_url: "https://suibex.github.io",
        redirect_link: "https://suibex.github.io/onPhantomConnect",
      });
   
      const url = `https://phantom.app/ul/v1/connect?${params.toString()}`;
      console.log(url)
  
      window.location.href = url
      
    }
    return (
      <div>
      
        <button onClick={connect}>Connect</button>
        <button onClick={disconnect}>Disconnect</button>


      </div>
    )
  }