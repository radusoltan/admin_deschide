import React, { useState } from 'react'
import { getItem } from '../utils/menuUtil'
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from '@ant-design/icons'
import { Button, Menu } from 'antd'
import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export const Navigation = () => {
  const {t} = useTranslation()

const items = [
    getItem(<Link to='/'>{t('menu.dashboard')}</Link>, 'dashboard', <PieChartOutlined />),
    getItem(t("menu.content.head"), 'content', <MailOutlined />, [
      getItem(<NavLink to="/content/categories">{t('menu.content.categories')}</NavLink>, 'content/categories'),
      getItem(<NavLink to="/content/articles">{t('menu.content.articles')}</NavLink>, 'content/articles'),
    ]),
    getItem(t('menu.management.nead'), 'management', <AppstoreOutlined />, [
      getItem(<NavLink to="/management/users">{t("menu.management.users")}</NavLink>, 'management/users'),
      getItem(<NavLink to="/management/roles">{t("menu.management.roles")}</NavLink>, 'management/roles'),
      getItem(<NavLink to="/management/permissions">{t("menu.management.permissions")}</NavLink>, 'management/permissions'),
    ]),
  ];


  return <Menu
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
        theme="dark"
        // inlineCollapsed={collapsed}
        items={items}
      />
}
