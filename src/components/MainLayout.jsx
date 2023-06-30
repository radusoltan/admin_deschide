import React, {useEffect, useState} from 'react'
import { Layout, Menu, Select, Button, Space } from 'antd'
import {
  Link, NavLink,Outlet,useNavigate
} from "react-router-dom"
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons'
import { Auth } from '../api/authApi'
import i18n from '../i18n'
import { useTranslation } from 'react-i18next'
import { Navigation } from './Navigation'
import {useAuth} from "../contexts/AuthContext";
import axios from "../lib/axios";


export const MainLayout = () => {
  
  const { Header, Sider, Content } = Layout
  const {SubMenu} = Menu
  const {Option} = Select
  const [collapsed,setCollapsed] = useState(false)
  const navigate = useNavigate()
  const {t} = useTranslation()

  const handleLogout = () => {
    Auth.logout(()=>{

      navigate('/login')
    },()=>{
      navigate('/login')
    })
  }

  const toggle = () => {
    setCollapsed(!collapsed)
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
            <Select defaultValue={'ro'} onChange={changeLang}>
              <Option value="ro">RO</Option>
              <Option value="ru">RU</Option>
              <Option value="en">EN</Option>
            </Select>
          </Space>
        </div>          
      </Header>
      <Content>
        <Outlet />
      </Content>
    </Layout>
  </Layout>
}
