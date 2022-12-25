import axios from '../lib/axios'

const loginURL = process.env.REACT_APP_API_URL + "/login"
const logoutURL = process.env.REACT_APP_API_URL + "/logout"
const checkURL = process.env.REACT_APP_API_URL + "/user"

export const Auth = {
  
  login: async (data, success, error) => {
    
    const response = await axios.post(loginURL, data).catch(e=>error(e.response.data))
    
    if (response.status === 200){
      success(response.data)
    } else {
      error(response)
    }
    

  },

  logout: async (success, error) => {
    const response = await axios.post(logoutURL,{},{
      headers: {
        "Authorization": "Bearer " + localStorage.getItem('token')//+'1',
      }
    }).catch(e=>error())

    if (response.status === 200){
      success()
    } else {
      error()
    }
  },

  checkAuth: async (success, error) => {
    const response = await axios.get(checkURL,{
      headers: {
        "Authorization": "Bearer " + localStorage.getItem('token')//+'1',
      }
    }).catch(e=>{
      localStorage.clear()      
      error(e.response)
    })

    if (response.status === 200){
      
      success(response)
    } else{ 
      localStorage.clear()
      error(response.response) 
    }
  }
  

}