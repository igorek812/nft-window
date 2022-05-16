import React, { useEffect, useState } from "react";
import './../App.css';
import NewNftForm from "./../components/new-nft-form";
import contractService from './../services/contract-service';

const CreateNftPage = () => {
    const [currentAccount, setCurrentAccount] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        (async () => {
            const account = await contractService.checkIfWalletIsConnected();

            if (account) {
                setCurrentAccount(account)
            }
        })();
    }, [])


    // MARK: - UI

    return (
        <div className="App">
            <div className="container">
                <div className="header-container">

                    <div style={{textAlign: 'right'}}>
                        {currentAccount === '' ? (
                            <button onClick={async () => {
                                const account = await contractService.connectWallet();
                                setCurrentAccount(account);
                            }} className="cta-button connect-wallet-button">
                                Connect to Wallet
                            </button>
                        ) : (
                            <div style={{color: 'white', height: '45px'}}>
                                <span style={{border: '1px solid white', padding: '15px', borderRadius: '6px'}}>Account: {currentAccount}</span>
                            </div>
                        )}
                    </div>

                    <p className="header gradient-text">Moloko NFT Collection</p>
                    <p className="sub-text">
                        Personal NFT collection.
                    </p>

                    <div className="body-text">

                        <NewNftForm createNft={(newNftData) => {
                            setIsLoading(true)
                            contractService.createNft(currentAccount, newNftData)
                            setIsLoading(false)
                        }} />

                    </div>

                    {isLoading
                        ? <h4>Loading...</h4>
                        : <div/>
                    }

                </div>
            </div>
        </div>
    );
};

export default CreateNftPage;