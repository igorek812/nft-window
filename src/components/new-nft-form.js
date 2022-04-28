import React, {useState} from 'react';
import {UploadClient} from "@uploadcare/upload-client";

const NewNftForm = ({createNft}) => {

    const [newNftData, setNewNFtData] = useState({
        name: '',
        description: '',
        price: '',
        imageUrl: ''
    });

    const create = () => {
        createNft(newNftData)
    }

    const uploadImageToServer = async (image) => {

        if (image === undefined) {
            console.log('Miss file');
            return
        }

        console.log('starting')

        let client = new UploadClient({
            publicKey: '5791e9da84eedb4777e1'
            // secret: 'afca50c056a5bd7b2b03'
        })

        client
            .uploadFile(image)
            .then(file => {

                let url = `https://ucarecdn.com/${file.uuid}/bTZMz.jpg`
                console.log('url = ', url)

                setNewNFtData({...newNftData, imageUrl: url});
            })
            .catch(error => {
                if (error.isCancel) {
                    console.log(`File uploading was canceled.`)
                }
            })
    }

    return (
        <div>
            <div className="form-item">
                Name: <input type="text" value={newNftData.name} onChange={e => {setNewNFtData({...newNftData, name: e.target.value})}} />
            </div>

            <div className="form-item">
                Description: <input type="text" value={newNftData.description} onChange={e => {setNewNFtData({...newNftData, description: e.target.value})}} />
            </div>

            <div className="form-item">
                Price(in MATIC) : <input type="text" value={newNftData.price} onChange={e => {setNewNFtData({...newNftData, price: e.target.value})}} />
            </div>

            <div className="form-item">
                ImageUrl: <input type="text" value={newNftData.imageUrl} onChange={e => {setNewNFtData({...newNftData, imageUrl: e.target.value})}} />
            </div>

            <div className="form-item">Image: <input type="file" multiple accept="image/*" onChange={e => {
                uploadImageToServer(e.target.files[0])
            }} /></div>

            <hr/>

            <div>
                <div>name: {newNftData.name}</div><br/>
                <div>description: {newNftData.description}</div><br/>
                <div>imageUrl: <a target="_blank" href={newNftData.imageUrl}>{newNftData.imageUrl}</a></div><br/>
            </div>

            <div className="form-item">
                <button onClick={create} className="cta-button connect-wallet-button">
                    Mint NFT
                </button>
            </div>
        </div>
    );
};

export default NewNftForm;