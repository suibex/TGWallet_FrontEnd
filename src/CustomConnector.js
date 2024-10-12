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

export const CustomConnector = () =>{
    
    //security threat --> FIX!
    const seedString = '8afae8729b48d24f94c6d6db41748bda3c62d6882f3d5b7d5f9c86e638b9a89f'
    const seed = util.decodeUTF8(seedString);

    const seed32Bytes = seed.slice(0, 32);
    const keypair = nacl.box.keyPair.fromSecretKey(seed32Bytes);
    
    const sol_network = WalletAdapterNetwork.Devnet;
    const sol_endpoint = useMemo(() => clusterApiUrl(sol_network), [sol_network]);
    
    const [PWPublicKey, setPWPublicKey] = useState("");
    const [PWSession, setPWSession] = useState("");
    const [session_nonce,setNonce] = useState("");
    const [sharedSecret,setSharedSecret] = useState("");

    useEffect(()=>{ 

        var url = new URL(window.location)
        var params = url.searchParams
      
        if (/onPhantomDisconnect/.test(url.pathname)) {
          setPWPublicKey(null);
          window.location.href="https://t.me/geocoldzmaj_bot/geocoldz/"
        }
      
        if(/onPhantomConnect/.test(url.pathname)){
          var raw_req = new URL(url).searchParams
          
          const sharedSecretDapp = nacl.box.before(
            bs58.decode(params.get("phantom_encryption_public_key")),
            keypair.secretKey
          );
         
          const decrypted_msg = nacl.box.open.after(
            bs58.decode(raw_req.get("data")),
            bs58.decode(raw_req.get("nonce")),
            sharedSecretDapp
          )

          /*
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
          */

          if(decrypted_msg){
         
            var decoded_data = JSON.parse(new TextDecoder().decode(decrypted_msg))
            
            setPWPublicKey(decoded_data['public_key'])
            setPWSession(decoded_data['session'])
            setNonce(raw_req.get("nonce"))
            setSharedSecret(sharedSecretDapp)

            //!! BIG SECURITY THREAT -> FIX AND ENCRYPT LATER
            var nprms = bs58.encode(new TextEncoder().encode((JSON.stringify(
              {
                "session":decoded_data['session'],
                "public_key":decoded_data['public_key'],
                "secret":sharedSecretDapp
              }
            ))))
            
            window.location.href=`https://t.me/geocoldzmaj_bot/geocoldz?startapp=onConnectApp${nprms}`

          }
          
        }
    },[])  
    

    const disconnect = () =>{
      var url = new URL(window.location)
      if(url.searchParams.has("tgWebAppStartParam")){
        if(url.searchParams.get("tgWebAppStartParam").toString().includes("onConnectApp")){
          var data = url.searchParams.get("tgWebAppStartParam").replace("onConnectApp","")

          data = bs58.decode(data)
          data = JSON.parse(String.fromCharCode.apply(null, data))

          setPWSession(data['session'])
          setPWPublicKey(data['public_key'].toString())
          
          var shscr = new Uint8Array(Object.values(data['secret']));
          const nonce = nacl.randomBytes(nacl.box.nonceLength);
 
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
            redirect_link: "https://edff-178-148-213-170.ngrok-free.app/onPhantomDisconnect",
            payload:bs58.encode(encr_json)
          });
          
          const urlz = `https://phantom.app/ul/v1/disconnect?${params.toString()}`;
          
          window.location.href = urlz
          window.Telegram.WebApp.close()
          
        }
      }
     
    }

    const connect = ()=>{

      const params = new URLSearchParams({
        dapp_encryption_public_key: bs58.encode(keypair.publicKey),
        cluster: sol_network,
        app_url: "https://suibex.github.io",
        redirect_link: "https://edff-178-148-213-170.ngrok-free.app/onPhantomConnect",
      });
   
      const url = `https://phantom.app/ul/v1/connect?${params.toString()}`;
  
      window.location.href = url
      window.Telegram.WebApp.close()
      
    }
    return (
      <div>
        <button onClick={connect}>Connect</button>
        <button onClick={disconnect}>Disconnect</button>
      </div>
    )
  }