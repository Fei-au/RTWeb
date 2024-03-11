import { Breadcrumb, Layout, theme } from 'antd';
import React from 'react';
import HomeSideNavigationMenu from '../../components/HomeSideNavigationMenu';
import NavigationMenu from '../../components/NavigationMenu';
import MyFooter from '../../components/Footer';
import { Content } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';

const HomeLayout = (props)=>{
    const {children, subItems} = props;

    return (
        <Layout>
            <NavigationMenu/>
            <HomeSideNavigationMenu subItems={subItems}>
                {children}
            </HomeSideNavigationMenu>
            <MyFooter></MyFooter>
        </Layout>
    );
}

export default HomeLayout;