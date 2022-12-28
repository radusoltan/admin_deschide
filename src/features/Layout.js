import React from 'react'
import {Outlet, useLocation, useNavigate} from "react-router-dom"
import {Auth} from "../hooks/auth"


export const Layout = ()=>{
  const navigate = useNavigate()
  const location = useLocation()

  Auth.checkAuth((r)=>{
    // console.log('Protected check success');
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
  return <>
    <h1>Main Layout</h1>
    <Outlet />
  </>
}