import React from 'react';
import {  Layout,  } from 'antd';
const {  Footer, } = Layout;


const MyFooter = () => {

  return (
      <Footer
        style={{
          textAlign: 'center',
        }}
      >
        Ruito Trading ©{new Date().getFullYear()} Created by Ruito Team
      </Footer>
  );
};
export default MyFooter;