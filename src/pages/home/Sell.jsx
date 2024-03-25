import React, {useState} from 'react';
import HomeLayout from './MyLayout';
import Uploader from '../../components/Uploader';

const subNav = [
    {title: 'Sell'}
];

function Sell (props){

    return (
        <HomeLayout subItems={subNav}>
            <div>
                <h3>Sold products uploader</h3>
                <Uploader />
            </div>

        </HomeLayout>
    );
}

export default Sell;