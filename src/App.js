import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom"
import './scss/app.scss'
import {MainLayout} from "./features/Layout/Layout";
import {Login} from "./features/Login";
import {Dashboard} from "./features/Dashboard";
import {Categories} from "./features/Content/Categories";
import {Category} from "./features/Content/Categories/Category";
import {Users} from "./features/Management/Users";
import {Roles} from "./features/Management/Roles";
import {Permissions} from "./features/Management/Permissions";
import {Article} from "./features/Content/Article";


const App = () => {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout/>,
      children: [
        { path: "/", element: <Dashboard/> },
        { path: "/content/categories", element: <Categories /> },
        { path: "/content/categories/:category", element: <Category /> },
        { path: "/content/articles/:article", element: <Article />  },
        { path: "/management/users", element: <Users/> },
        { path: "/management/roles", element: <Roles/> },
        { path: "/management/permissions", element: <Permissions/> },
      ]
    },
    {
      path: "/login",
      element: <Login />
    }
  ])

  // const router = createBrowserRouter(
  //   createRoutesFromElements(
  //     <>
  //       <Route path="/" element={<Protected />}>
  //         <Route index element={<Dashboard />} />
  //         <Route path="content/categories" element={<CategoriesList/>} />
  //         <Route path="content/category/:category" element={<Category />} />
  //         <Route path="content/articles" element={<Articles/>} />
  //         <Route path="content/article/:article" element={<ArticleFormPage />} />
  //         <Route path="media" element={<MediaLibrary />} />
  //         <Route path="management/users" element={<Users />} />
  //         <Route path="management/roles" element={<Roles />} />
  //         <Route path="management/permissions" element={<Permissions />} />
  //       </Route>
  //       <Route path="/login" element={<Login />} />
  //     </>
  // )
  // );

  return <RouterProvider router={router}/>
}

export default App
