import { Route, Routes } from "react-router-dom"
import { Dashboard } from "./components/Dashboard"
import { Login } from "./components/Login"
import { Protected } from "./components/Protected"
import { Categories } from "./components/content/categories"
import './scss/app.scss'
import { Articles } from "./components/content/articles"
import { Category } from "./components/content/categories/category"


import Users from "./components/management/users"
import Roles from "./components/management/roles"
import Permissions from "./components/management/permissions"
import ArticleFormPage from "./components/content/articles/article";


const App = () => {
  return <Routes>
    <Route path="/" element={<Protected />}>
      <Route index element={<Dashboard />} />
      <Route path="content/categories" element={<Categories/>} />
      <Route path="content/category/:category" element={<Category />} />
      <Route path="content/articles" element={<Articles/>} />
      <Route path="content/article/:article" element={<ArticleFormPage />} />
      <Route path="management/users" element={<Users />} />
      <Route path="management/roles" element={<Roles />} />
      <Route path="management/permissions" element={<Permissions />} />
    </Route>
    <Route path="/login" element={<Login />} />
  </Routes>
}

export default App
