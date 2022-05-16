import React from 'react';

const NftCard = (props) => {
    return (
        <div key={props.card.name} className="nft-card-item">
            <div><img src={props.card.image} alt={props.card.name}/></div>
            <div className="nft-card-item-info">
                <div className="nft-card-item-info-item">
                    <b>name: </b>
                    <span className="nft-card-item-info-item-description">{props.card.name}</span>
                </div>
                <div className="nft-card-item-info-item">
                    <b>description: </b>
                    <span className="nft-card-item-info-item-description">{props.card.description}</span>
                </div>
                <div className="nft-card-item-info-item">
                    <b>price: </b>
                    <span className="nft-card-item-info-item-description">{props.card.price} MATIC</span>
                </div>
                <div className="nft-card-item-info-item">
                    <b>owner: </b>
                    <span className="nft-card-item-info-item-description">{props.card.owner}</span>
                </div>
                <div className="nft-card-item-info-item" style={{textAlign: 'right'}}>
                    <button value={props.card} onClick={() => {
                        props.action(props.card)
                    }}>Купить</button>
                </div>
            </div>
        </div>
    );
};

export default NftCard;