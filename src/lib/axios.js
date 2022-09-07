import axios from "axios"

axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
})

export default axios