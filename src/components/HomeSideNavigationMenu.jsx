import React, { useState } from 'react';
import { AreaChartOutlined, DatabaseOutlined, LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { useNavigate } from 'react-router-dom';
const { Content, Sider } = Layout;

const items2 = [
  {
    key: `inventory`,
    icon: (<DatabaseOutlined />),
    label: `Inventory`,
  },
  {
    key: `dashboard`,
    icon: (<AreaChartOutlined />),
    label: `Dashboard`,
  },
]

const HomeSideNavigationMenu = (props) => {

  const {children, subItems} = props;
  const navigate = useNavigate();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const onClick = (item)=>{
    navigate(`/${item.key}`)
  }

  return (
      <Content
        style={{
          padding: '0 48px',
        }}
      >
        <Breadcrumb
          style={{
            margin: '16px 0',
          }}
          items={[
            {title: 'Home'},
            ...subItems,
          ]}
        >
        </Breadcrumb>
        <Layout
          style={{
            padding: '24px 0',
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Sider
            style={{
              background: colorBgContainer,
            }}
            width={200}
          >
            <Menu
              mode="inline"
              defaultSelectedKeys={['sub1']}
              onClick={onClick}
              style={{
                height: '100%',
              }}
              items={items2}
            />
          </Sider>
          <Content
            style={{
              padding: '0 24px',
              minHeight: 280,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Content>
  );
};
export default HomeSideNavigationMenu;