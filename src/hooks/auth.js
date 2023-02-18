import useSWR from "swr";
import axios from "../lib/axios";
import { useNavigate } from "react-router-dom"
import {useEffect} from "react";
import {getUser} from "../api/userApi";


export const useAuth = (
  { middleware, redirectIfAuthenticated } = {}
) => {

  const navigate = useNavigate()



  const {data: user, error, mutate, isLoading} = useSWR("api_user", getUser)

  const login = (data)=>{

    axios.post('/login', data,)
        .then((r)=> {
          localStorage.setItem('token',r.data.token)
          mutate()
        })
        .catch(e=>console.log(e.response.data))

  }

  const logout = async ()=>{

    await axios.post('/logout',{},{
      headers: {
        "Authorization": "Bearer " + localStorage.getItem('token')//+'1',
      }
    }).then(()=>mutate()).catch(e=>console.log(e))

    localStorage.clear()

    window.location.pathname = '/login'

  }

  useEffect(() => {

    if (middleware === 'guest' && redirectIfAuthenticated && user){
      // navigate(redirectIfAuthenticated)
      window.location.pathname = redirectIfAuthenticated
    }

    if (middleware==="auth" && error) logout()



  }, [user, error]);


  return {
    user: user?.user,
    // user: user.user,
    permissions: user?.permissions,
    login,
    logout,
    isLoading
  }

}