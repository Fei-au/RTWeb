import React, { useState } from 'react';
import {  Layout, Menu,  } from 'antd';
const { Header, } = Layout;
const items1 = [
  {
    key: 0,
    label: `Home`,

  },
  {
    key: 1,
    label: `Product`,
  },
  {
    key: 2,
    label: `Vendor`,
  },
  {
    key: 3,
    label: `Customer`,
  },
  {
    key: 4,
    label: `Help`,
  },
  {
    key: 5,
    label: `Profile`,
  },
];


const NavigationMenu = () => {
  const [activeItem, setActiveItem] = useState('0');


  return (
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['0']}
          items={items1}
          onClick={setActiveItem}
          style={{
            flex: 1,
            minWidth: 0,
          }}
        />
      </Header>
  );
};
export default NavigationMenu;