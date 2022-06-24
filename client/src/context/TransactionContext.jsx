import React, {useEffect , useState} from 'react';
import {ethers } from 'ethers';

import {contractABI , contractAddress} from '../utils/constants';

export const TransactionContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress,contractABI, signer);

    return transactionContract;
}

export const TransactionProvider = ({children}) => {
    const [currentAccount, setCurrentAccount] = useState("");
    const [formData,setFormData] = useState({addressTo : '',amount: '', keyword: '', message: ''});
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));
    const [transactions,setTransaction] = useState([])


    const handleChange = (e,name) => {
        setFormData((prevState)=>({
            ...prevState, [name]: e.target.value
        }))
    }
    const getAllTransactions = async () => {
        try {
            if(!ethereum){
                return alert("Please Install Metamask");
            }
        const transactionContract = getEthereumContract();
        const availableTransactions = await transactionContract.getAllTransactions();
            
        const structuredTransactions = availableTransactions.map((transaction) => ({
            addressTo: transaction.receiver,
            addressFrom : transaction.sender,
            timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
            message: transaction.message,
            keyword: transaction.keyword,
            amount: parseInt(transaction.amount._hex) / (10 ** 18) // to get GWEI value which is in hex to 'eth' value
        }))

        setTransaction(structuredTransactions);
        // console.log(structuredTransactions);
        
        } catch (error) {
            console.log(error);
        }
    }

    const checkIfWalletIsConnected = async () => {
        try {
            if(!ethereum){
                return alert("Please Install Metamask");
            }
            const accounts = await ethereum.request({method: 'eth_accounts'});
    
            if(accounts.length){
                setCurrentAccount(accounts[0]);
                
                //get all transaction
                getAllTransactions();
            }
            else{
                console.log("No account found");
            }
            // console.log(accounts);
        } catch (error) {
            throw new Error("No ethereum object.")
            
        }
        
        
    }
    const checkifTransactionExist = async () => {
        try {
            if (ethereum) {
                const transactionsContract = getEthereumContract();
                const currentTransactionCount = await transactionsContract.getTransactionCount();
        
                window.localStorage.setItem("transactionCount", currentTransactionCount);
              }
        } catch (error) {
            console.log(error);

            throw new Error("No ethereum object..")
        }
    }
    const connectWallet = async () => {
        try {
            if(!ethereum){
                return alert("Please Install Metamask");
            }
            const accounts = await ethereum.request({method: 'eth_requestAccounts'});
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error);

            throw new Error("No ethereum object.")
        }
    }

    const sendTransaction = async () => {
        try {
            if(!ethereum){
                return alert("Please Install Metamask");
            }
            //getting data from form...
        const {addressTo,amount,keyword,message} = formData;
        const transactionContract = getEthereumContract();
        const parsedAmount = ethers.utils.parseEther(amount) //to get hexadeciml of entered amount
        await ethereum.request({
            method: 'eth_sendTransaction',
            params: [{
                from: currentAccount,
                to: addressTo,
                gas: '0x5208', //21000 GWEI (eth small unit)
                value: parsedAmount._hex,

            }]
        });

        const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount,message,keyword);
        // console.log(transactionHash);
        setIsLoading(true);
        console.log(`Loading... - ${transactionHash.hash}`);
        await transactionHash.wait();
        alert(`Success... - Transaction Hash:  ${transactionHash.hash}`);
        setIsLoading(false);

        const transactionCount = await transactionContract.getTransactionCount();
        setTransactionCount(transactionCount.toNumber());

        window.location.reload();

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected();
        checkifTransactionExist();
    },[])
    return(
        <TransactionContext.Provider value={{connectWallet, currentAccount, transactions,formData,sendTransaction,handleChange}} >
            {children}
        </TransactionContext.Provider>
    )
} 
