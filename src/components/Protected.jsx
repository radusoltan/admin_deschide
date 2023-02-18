import React from 'react'
import { Outlet, useNavigate, useLocation  } from 'react-router-dom'
import { MainLayout } from './MainLayout'
import { Auth } from '../api/authApi'
import useSWR from "swr";
import axios from "../lib/axios";


export const Protected = () => {

  console.log("Protected")

  const {data: user, error, mutate} = useSWR('/api/user', async ()=>{

    const response = await axios.get("/user")

    return {
      user: response.data,
      mutate
    }

  })

  const navigate = useNavigate()
  const location = useLocation()

  Auth.checkAuth((r)=>{
    mutate()
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

  return <MainLayout />
}
