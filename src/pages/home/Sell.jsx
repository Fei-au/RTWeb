import React, {useState} from 'react';
import HomeLayout from './MyLayout';
import Uploader from '../../components/Uploader';
import { Divider, Space } from 'antd';

const subNav = [
    {title: 'Sell'}
];

function Sell (props){

    const [links, setLinks] = useState([]);

    const handleAddNewLink = (link, name)=>{
        const tempLinks = links.slice()
        tempLinks.push({
            link: link,
            name: name,
        });
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
                            return <a target='_blank' herf={ele.link}>Click to download {ele.name}</a>
                        })
                    }
                </Space>

            </div>

        </HomeLayout>
    );
}

export default Sell;