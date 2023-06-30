import { createContext, useContext, useState } from 'react'
import axios from "../lib/axios"

const AuthContent = createContext({
    user: null,
    setUser: () => { },
    csrfToken: null,
})

export const AuthProvider = ({ children }) => {
    const [user, _setUser] = useState(
        JSON.parse(localStorage.getItem('user')) || null
    )

    const setUser = (user) => {
        console.log('setUser', user)
        if (user){
            localStorage.setItem('user', JSON.stringify(user))
        } else {
            localStorage.removeItem('user')
        }
        _setUser(user)
    }

    const csrfToken = async ()=>{
        await axios.get(process.env.REACT_APP_URL + '/sanctum/csrf-cookie')
        return true
    }

    return (
        <AuthContent.Provider value={{ user, setUser, csrfToken }}>
            {children}
        </AuthContent.Provider>
    )
}

export const useAuth = () => useContext(AuthContent)