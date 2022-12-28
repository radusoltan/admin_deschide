
import { createBrowserRouter, RouterProvider} from "react-router-dom"
import {Layout} from "./features/Layout";
import {Login} from "./features/Login";



function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {path: "/dashboard", element: <>Dash</>},
        {path: "/content/categories", element: <>Categories</>},
        {path: "/content/categories/:category", element: <>Category</>},
        {path: "/content/articles", element: <>Articles</>},
        {path: "/content/articles/:article", element: <>Dash</>},
        {path: "/management/users", element: <>Users</>},
        {path: "/management/roles", element: <>Roles</>},
        {path: "/management/permissions", element: <>Permissions</>}
      ]
    },
    {
      path: "/login",
      element: <Login />
    }
  ]);

  return <RouterProvider router={router} />
}

export default App;
