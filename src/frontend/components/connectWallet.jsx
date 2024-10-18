import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

function WalletConnect() {
  const [account, setAccount] = useState(null);

  // Check if wallet is connected on page load and reset account
  useEffect(() => {
    checkIfWalletIsConnected();

    // Listen for account changes (disconnect or switch accounts)
    window.ethereum?.on("accountsChanged", handleAccountChange);

    // Cleanup event listener when component unmounts
    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountChange);
    };
  }, []);

  // Function to check if wallet is already connected
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (ethereum) {
      const accounts = await ethereum.request({ method: "eth_accounts" });
      
      // If no account is connected, reset the account state
      if (accounts.length === 0) {
        setAccount(null);  // Reset on reload if not connected
      } else {
        setAccount(accounts[0]);
      }
    }
  };

  // Handle account change or disconnection
  const handleAccountChange = (accounts) => {
    if (accounts.length === 0) {
      // Reset state when wallet is disconnected
      setAccount(null);
    } else {
      // If account is switched, update the state
      setAccount(accounts[0]);
    }
  };

  // Function to connect the wallet
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        setAccount(accounts[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Function to disconnect the wallet (reset state)
  const disconnectWallet = () => {
    setAccount(null); // Reset account to null to simulate disconnection
  };

  return (
    <div>
      <h1>Connect to MetaMask</h1>
      {account ? (
        <div>
          <p>Connected Account: {account}</p>
          <button onClick={disconnectWallet}>Disconnect Wallet</button>
        </div>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
}

export default WalletConnect;
