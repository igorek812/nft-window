import React, { useEffect, useState } from "react";
import './../App.css';
import NftCard from "./../components/nft-card/nft-card";
import contractService from './../services/contract-service';

const MainPage = () => {
    const [currentAccount, setCurrentAccount] = useState('');

    const [nftArray, setNftArray] = useState([]);
    const [isNftLoading, setIsNftLoading] = useState(false);


    useEffect( () => {
        (async () => {
            const account = await contractService.checkIfWalletIsConnected();

            if (account) {
                setCurrentAccount(account)
            }

            setIsNftLoading(true);
            const nftArray = await contractService.getAllNFT();
            setIsNftLoading(false);
            if (nftArray && nftArray.length > 0) {
                setNftArray(nftArray)
            }
        })();
    }, [])

    const nftAction = async (item) => {

        if (currentAccount === '') {
            alert('Подключите кошелек!');
            return;
        }

        // const newUri = "data:application/json;base64,eyJuYW1lIjogInNlY29uZCIsICJkZXNjcmlwdGlvbiI6ICIxMjMiLCAiaW1hZ2UiOiAiaHR0cHM6Ly9waXRlcmdzbS5ydS91cGxvYWQvcmVzaXplX2NhY2hlL2libG9jay84OTkvMzc4XzIyMF8xLzg5OTBhMWQ5MjA2ZWQzN2E4ZTI2NzM1ZTc4NzI3YjNiLnBuZyIgfQ=="

        // const nftOwner = await contractService.getOwnerNft(currentAccount, id)
        // console.log('nftOwner = ', nftOwner)

        // await changeNftUri(id, newUri);
        // await transferNft(id, WALlET_TEST2)
        // await getOwnerNft(id);
        // await mintNft(id);
        await contractService.buyItem(currentAccount, item.tokenId, item.price);
    }

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

                    <div style={{color: 'white', textAlign: 'center'}}>
                        {isNftLoading
                            ? <h3>Загрузка...</h3>
                            : <div>
                                <div className="nft-card-container">
                                    {nftArray.map((item, index) =>
                                        <NftCard key={index + 1} card={item} action={nftAction}/>
                                    )}
                                </div>
                            </div>
                        }
                    </div>

                </div>
            </div>
        </div>
    );
};

export default MainPage;