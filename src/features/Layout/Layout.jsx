import React, {useEffect, useState} from 'react'
import {Outlet, useLocation, useNavigate} from "react-router-dom"
import {Auth} from "../../api/authApi"
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import {Button, Layout, Select, Space, Spin} from 'antd';
import i18n from "../../i18n";
import {Navigation} from "./Navigation";
import Cookies from 'universal-cookie';
import useSWR from "swr";
import axios from "../../lib/axios";
import {useAuth} from "../../hooks/auth";
const { Header, Sider, Content } = Layout;
const {Option} = Select
const cookies = new Cookies();
export const MainLayout = ()=>{

  const {logout, isLoading, user} = useAuth({
    middleware: "auth"
  })

  const [collapsed,setCollapsed] = useState(false)
  const toggle = () => {
    setCollapsed(!collapsed)
  }

  const handleLogout = () => {
    logout()
  }

  const changeLang = language => {
    i18n.changeLanguage(language)
  }


  return <Layout>
    <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
    >
      <Navigation />
    </Sider>
    <Layout className="site-layout">
      <Header className="site-layout-background" style={{ padding: 0 }}>
        {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: toggle,
            }
        )}
        <div className='header-buttons'>
          <Space>
            <Button onClick={handleLogout}>Log Out</Button>
            <Select defaultValue={i18n.language} onChange={changeLang}>
              <Option value="ro">RO</Option>
              <Option value="ru">RU</Option>
              <Option value="en">EN</Option>
            </Select>
          </Space>
        </div>
      </Header>
      <Content>
        {
          isLoading ? <Spin/> : <Outlet />
        }
      </Content>
    </Layout>
  </Layout>
}