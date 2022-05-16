import React from 'react';

const MySelect = ({value, onChangeSelect}) => {

    const selectOptions = [
        {name: 'changeNftUri', value: 'changeUri'},
        {name: 'transferNft', value: 'transfer'},
        {name: 'getOwnerNft', value: 'getOwner'},
        {name: 'mintNft', value: 'mint'}
    ]

    return (
        <select
            value={value}
            onChange={event => {
                onChangeSelect(event.target.value)
            }}
        >
            <option disabled value="">Выберите действие</option>
            {selectOptions.map(option =>
                <option key={option.value} value={option.value}>
                    {option.name}
                </option>
            )}
        </select>
    );
};

export default MySelect;