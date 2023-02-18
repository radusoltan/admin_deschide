import useSWR from "swr"
import {Auth} from "../api/authApi";

export const useUser = ()=>{
  const {} = useSWR('api_user', Auth.checkAuth)
}