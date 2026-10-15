import { useState, createContext } from "react";
import PropTypes from "prop-types";
import { Web3 } from "web3";
import ABI from "./ABI.json";

const WalletContext = createContext();

const Wallet = ({ children }) => {
  const [state, setState] = useState({
    web3: null,
    contract: null,
  });

  const init = async () => {
      if (!window.ethereum) {
        console.error("No injected Ethereum wallet was found.");
        return;
      }

      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const contractAddress = "0xa16aa576F21B67F7e882EB391D432e1FA75cDf7A";
      const contract = new web3.eth.Contract(ABI, contractAddress);
      setState({ web3, contract });
  };

  return (
    <>
     <WalletContext.Provider value={state}>{children}</WalletContext.Provider>
    <button onClick={init}>Connect Metamask</button>
    </>
   
  );
};

Wallet.propTypes = {
  children: PropTypes.node.isRequired,
};
export { WalletContext };
export default Wallet;
