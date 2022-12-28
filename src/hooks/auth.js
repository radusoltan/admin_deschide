import axios from "../lib/axios"

export const Auth = {
  login: async (data, success, error) => {


    const response = await axios.post('/login', data).catch(e=>error(e.response.data))

    if (response.status === 200){
      success(response.data)
    } else {
      error(response)
    }

  },

  logout: async (success, error) => {
    const response = await axios.post('/logout',{},{
      headers: {
        "Authorization": "Bearer " + localStorage.getItem('token')
      }
    }).catch(e=>error())

    if (response.status === 200){
      success()
    } else {
      error()
    }
  },

  checkAuth: async (success, error) => {

    const response = await axios.get('/user',{
      headers: {
        "Authorization": "Bearer " + localStorage.getItem('token')
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