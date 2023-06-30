import React from 'react'
import { Outlet, useNavigate, useLocation  } from 'react-router-dom'
import { MainLayout } from './MainLayout'
import { Auth } from '../api/authApi'


export const Protected = () => {

  const navigate = useNavigate()
  const location = useLocation()

  Auth.checkAuth((r)=>{
      console.log('Protected check success');
    },(e)=>{
      navigate('/login',location.pathname)
    })
  
  
  setInterval(()=>{
    Auth.checkAuth((r)=>{
      // console.log('Protected check success');
    },(e)=>{
      navigate('/login',location.pathname)
    })
  },60000)

  return <MainLayout />
}
