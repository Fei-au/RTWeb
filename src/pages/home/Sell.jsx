import React, {useState} from 'react';
import HomeLayout from './MyLayout';
import Uploader from '../../components/Uploader';
import { Divider } from 'antd';

const subNav = [
    {title: 'Sell'}
];

function Sell (props){

    const {links, setLinks} = useState([]);

    handleAddNewLink = (link)=>{
        tempLinks = links.slice()
        tempLinks.push(link);
        setLinks(tempLinks);
    }
    return (
        <HomeLayout subItems={subNav}>
            <div>
                <h3>Sold products uploader</h3>
                <Uploader addNewLink={handleAddNewLink}/>

                <Divider/>
                <Space direction='vertical'>
                    {
                        links.map(ele=>{
                            return <p>{ele}</p>
                        })
                    }
                </Space>

            </div>

        </HomeLayout>
    );
}

export default Sell;