import {ethers} from "ethers";
import contractData from "../utils/MolokoNFT.json";

// const CONTRACT_ADDRESS = "0xFAa333Ef7cCc28B418cb98F385101abaae175D73";
// const CONTRACT_ADDRESS = "0x710dde1a33a13700faB57fdD2078393884a7E33E"; // with change uri
// const CONTRACT_ADDRESS = "0xa6E2F5C03a8CFe20e5EfFcF67d8d3CBD249F6fBc"; // with mint
// const CONTRACT_ADDRESS = "0x505FbA675b22D5Ee80808daF8d98dcbFb3e38a1b"; // with mint
const CONTRACT_ADDRESS = "0x11E6F8D8439e5428961439d6e97b28f1779eE7EA"; // polygon_test

// const WALlET_TEST = "0xaA7A746eF21C7786c9A585347529af46BbcD8029";
// const WALlET_TEST2 = "0x284d97066FBbe088EB188d0CF2923Af12c17D2C5";

const checkIfWalletIsConnected = async () => {

    const { ethereum } = window;

    if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);

        return account;

    } else {
        console.log("No authorized account found");
    }
}

const connectWallet = async () => {
    try {
        const { ethereum } = window;

        if (!ethereum) {
            alert("Get MetaMask!");
            return;
        }

        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        const account = accounts[0];

        console.log("Connected = ", account);

        return account;

    } catch (error) {
        console.log(error);
    }
}

const getAllNFT = async () => {
    try {
        const { ethereum } = window

        if (!ethereum) {
            console.log("Ethereum object doesn't exist!")
            return;
        }

        const provider = new ethers.providers.Web3Provider(ethereum)
        // const signer = provider.getSigner()
        const nftContract = new ethers.Contract(CONTRACT_ADDRESS, contractData.abi, provider)

        const nfts = await nftContract.fetchItems();
        const nftCount = nfts.length;

        let nftArray = [];

        for (let i = 0; i < nftCount; i++) {

            const base64TokenUri = nfts[i].tokenURI.replace("data:application/json;base64,", "");
            let tokenUri = atob(base64TokenUri);
            tokenUri = JSON.parse(tokenUri)
            tokenUri.price = ethers.utils.formatUnits(nfts[i].price, 'ether');
            tokenUri.owner = nfts[i].owner;
            tokenUri.tokenId = i;

            nftArray.push(tokenUri)
        }

        console.log('nftArray = ', nftArray)

        return nftArray

    } catch (error) {
        console.log(error)
        // setTxError(error.message)
    }
}

const changeNftUri = async (currentAccount, tokenId, newUri) => {

    const isConfirm = window.confirm("changeNftUri?");

    if (!isConfirm) {
        console.log('isConfirm = ', isConfirm);
        return
    }

    const ethereum = window.ethereum;

    if (ethereum === undefined || currentAccount === undefined) {
        console.log('account undefined');
        console.log('window.ethereum = ', ethereum);
        return
    }

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, contractData.abi, signer);

    const nftTxn = await connectedContract.updateTokenURI(tokenId, newUri);

    console.log("Mining...please wait.")
    await nftTxn.wait();

    console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
}

const transferNft = async (currentAccount, tokenId, to) => {

    console.log('currentAccount = ', currentAccount)
    console.log('tokenId = ', tokenId)
    console.log('to = ', to)

    const isConfirm = window.confirm("transferNft?");

    if (!isConfirm) {
        console.log('isConfirm = ', isConfirm);
        return
    }

    const ethereum = window.ethereum;

    if (ethereum === undefined || currentAccount === undefined) {
        console.log('account undefined');
        console.log('window.ethereum = ', ethereum);
        return
    }

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, contractData.abi, signer);

    const nftTxn = await connectedContract.transferFrom(currentAccount, to, tokenId);

    console.log("Mining...please wait.")
    await nftTxn.wait();

    console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
}

const mintNft = async (currentAccount, tokenId) => {

    const isConfirm = window.confirm("mintNft?");

    if (!isConfirm) {
        console.log('mintNft = ', isConfirm);
        return
    }

    const ethereum = window.ethereum;

    if (ethereum === undefined || currentAccount === undefined) {
        console.log('account undefined');
        console.log('window.ethereum = ', ethereum);
        return
    }

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, contractData.abi, signer);

    const nftTxn = await connectedContract.resellToken(tokenId);

    console.log("Mining...please wait.")
    await nftTxn.wait();

    console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
}

const createNft = async (currentAccount, newNftData) => {

    const name = newNftData.name;
    const description = newNftData.description;
    const price = newNftData.price;
    const imageUrl = newNftData.imageUrl;

    if (name === '' || description === '' || price === '' || imageUrl === '') {
        console.log('ERROR')
        console.log('name = ', name)
        console.log('description = ', description)
        console.log('price = ', price)
        console.log('imageUrl = ', imageUrl)
        return
    }

    const json = `{"name": "${name}", "description": "${description}", "image": "${imageUrl}" }`;

    //const totalPrice = ethers.utils.parseEther(price);
    const totalPrice = ethers.utils.parseUnits(price, 'ether');

    const data = btoa(json);

    try {
        const { ethereum } = window;

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();

            const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, contractData.abi, signer);

            console.log("Going to pop wallet now to pay gas...")
            let nftTxn = await connectedContract.mint(`data:application/json;base64,${data}`, totalPrice);

            console.log("Mining...please wait.")
            await nftTxn.wait();

            console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);

        } else {
            console.log("Ethereum object doesn't exist!");
        }
    } catch (error) {
        console.log(error)
    }
}

const getOwnerNft = async (currentAccount, tokenId) => {

    const isConfirm = window.confirm("getOwnerNft?");

    if (!isConfirm) {
        console.log('isConfirm = ', isConfirm);
        return
    }

    const ethereum = window.ethereum;

    if (ethereum === undefined || currentAccount === undefined) {
        console.log('account undefined');
        console.log('window.ethereum = ', ethereum);
        return
    }

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, contractData.abi, signer);

    const nftOwner = await connectedContract.ownerOf(tokenId);

    return nftOwner;
}

const buyItem = async (currentAccount, tokenId, price) => {

    const isConfirm = window.confirm("buyItem?");

    if (!isConfirm) {
        console.log('isConfirm = ', isConfirm);
        return
    }

    const ethereum = window.ethereum;

    if (ethereum === undefined || currentAccount === undefined) {
        console.log('account undefined');
        console.log('window.ethereum = ', ethereum);
        return
    }

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, contractData.abi, signer);

    await connectedContract.buyItem(tokenId, {
        value: ethers.utils.parseEther(price)
    });
}

export default {
    checkIfWalletIsConnected,
    connectWallet,
    getAllNFT,
    changeNftUri,
    transferNft,
    mintNft,
    createNft,
    getOwnerNft,
    buyItem
};
