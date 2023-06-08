'use client'
import Head from "next/head";
import Image from "next/image";
import style from "./page.module.css";
import Web3Modal from "web3modal";
import { providers , Contract } from "ethers";
import { useState,useRef, useEffect } from "react";
import { WHITELIST_CONTRACT_ADDRESS, abi} from "../../constants";

import cryptoDev from "../../public/crypto-devs.svg"

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false); // this is to see if the wallet is connected to the metamask or not.

  const [joinedWhiteList, setJoinedWhiteList] = useState(false); // this will keep the info of the account have joined the whitelist or not.

  const [loading , setLoading] = useState(false);

  const [numberOfWhiteListed, setNumberOfWhiteListed] = useState(0); // it tracks the number of accounts whitelisted.

  const web3ModalRef = useRef(); 


  // with below function we will get the provider or a signer based on the parameter and by default we will get the provider and it will also check wheater we are connected to the sepolia network or not, if not then we will notify the user to change the netwrok. 
  const getProviderOrSigner = async (needSigner = false) =>
  {
    const provider = await web3ModalRef.current.connect(); 

    const web3Provider = new providers.Web3Provider(provider);

    const {chainId} = await web3Provider.getNetwork(); // it will return a object that has chainId of the current web3 provider and we can check it below and call out the user. 

    if (chainId !== 11155111) {
      window.alert("Change the network to Sepolia");
      throw new Error("Change the network to Sepolia"); 
    }

    if (needSigner){
      const signer = web3Provider.getSigner();
      return signer; 
    }

    return web3Provider; 

  };

  // with below function we will add the the current connecte account in the white list
  const addAddressToWhiteList = async () => 
  {
    try 
    {
      const signer = await getProviderOrSigner(true); 

      const whiteListContract = new Contract (
        WHITELIST_CONTRACT_ADDRESS,
        abi, 
        signer
      )

      const tx = await whiteListContract.addAddressToWhiteList().
      setLoading(true); 
      
      await tx.wait();
      setLoading(false)

      await getNumberOfWhiteListed();
      setJoinedWhiteList(true); 
    }
    catch(error) 
    {
      console.log(error);
    }
  }

  // gets the number of the whitedlisted address
  const getNumberOfWhiteListed = async () => 
  {
    try {
      // we will get the provider form the web3modal function above
      const provider = await getProviderOrSigner()

      // creating an instance for the provider. 
      const whiteListContract = new Contract (
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        provider
      );
      
      const _numberOfWhiteListed = await whiteListContract.numAddressesWhitelisted(); // we are call the getter functon of a public variable from the contract. 
      setNumberOfWhiteListed(_numberOfWhiteListed);
    }
    catch (error) {
      console.log(error)
    }
  }

  // check if the address is in the whitelist
  const checkIfAddressInWhiteList = async () => 
  {
   try{

    const signer = await getProviderOrSigner(true); 

    const whiteListContract = new Contract (
      WHITELIST_CONTRACT_ADDRESS, 
      abi,
      signer
    ); 
    
    const address = await signer.getAddress();

    // calling whiteListedAddress from the contract 
    const _joinedWhiteList = await whiteListContract.whiteListedAddress(address); // this will return us a bool value, if address is in whiteList then true and if not then false. 
    setJoinedWhiteList(_joinedWhiteList);  // this will set accoring to the above value.
   }
   catch(error){
    console.log(error);
   } 

  }

  // it will connect the wallet to metamask
  const connectWallet = async() => 
   {
    try{
      await getProviderOrSigner();
      setWalletConnected(true);
      
      checkIfAddressInWhiteList();
      getNumberOfWhiteListed();
    }
    catch (error) {
      console.log(error);
    }
   };

  // returns a button based on the state of the dapp

  const renderButton = () => 
  {
    if (walletConnected){
      if (joinedWhiteList){
        return(
          <div className={style.desription}>
            Thanks for joining the WhiteList
          </div>
        );
      }
      else if (loading) {
        return <button className={style.button}>Loading...</button>;
      }
      else {
        return (
          <button onClick={addAddressToWhiteList} className={style.button}>
            Join the WhiteList.
          </button>
        )
      }
    }
    else {
      return (
        <button onClick={connectWallet} className={style.button}>
          Connect your Wallet
        </button>
      )
    }
  }

  useEffect(() => 
  {
    if (!walletConnected){
      web3ModalRef.current = new Web3Modal({
        network: "sepolia",
        providerOptions: {},
        disableInjectedprovider: false,
      })

      connectWallet();
    }
  }, [walletConnected])

  return (
    <div>
      <Head>
        <title>WhiteList Daap</title>
        <meta name="description" content="WhiteList-Daap" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={style.main}>

        <div>
          <h1 className={style.title}> Welcome to Devs On Chain!</h1>
          <div className={style.description}>
            It&#39;s an NFT collection for developers in Blockcahin.
          </div>
          <div className={style.desription}> 
            {console.log(numberOfWhiteListed)}
            {numberOfWhiteListed} people have already joined the WhiteList.
          </div>
          {renderButton()}
        </div>
        <div>
          <Image src={cryptoDev} alt="Image of a coder coding"></Image>
        </div>
      </div>

      <footer className={style.footer}>
        Made with &#10084; by Shakti Dubey
      </footer>
    </div>
  )
}
