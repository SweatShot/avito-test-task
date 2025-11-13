import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
// import GuardUser from "./guard/GuardUser";
// import GuardArtist from "./guard/GuardArtist";
// import GuardAdmin from "./guard/GuardAdmin";




// const MainPage = lazy(() => import('@pages/MainPage'))
// const AccUserPage = lazy(() => import('@pages/AccUserPage'))
// const AccArtistPage = lazy(() => import('@pages/AccArtistPage'))
// const CatalogPage = lazy(() => import('@pages/CatalogPage'))
// const AdminLogin = lazy(() => import('@features/auth/components/AdminLogin'))
// const AdminPage = lazy(() => import('@pages/AdminPage'))
// const ProductPage = lazy(() => import('@pages/ProductPage'))
// const AiCatalog  = lazy(() => import('@pages/AiCatalog'))
const ListPage = lazy(() => import('../../pages/ListPage/ListPage'))

const Routes : RouteObject[] = [
  { path: "/", element: <Navigate to="/list" replace /> },
  { path: "/list", element: <ListPage /> },
    // {path:'/', element:<MainPage/>},
    // {path:'/catalog/:category', element:<CatalogPage/>},
    // {path:'/s234234sdfsd345354', element:<AdminLogin/>},
    // {path:'/productpage/:id', element:<ProductPage/>},
    // {path:'/aisearch', element:<AiCatalog/>},
    // {
    //     element: <GuardUser/>,
    //     children: [
    //         { path: '/user', element: <AccUserPage/> }
    //     ]
    // },

    // {
    //     element: <GuardArtist/>,
    //     children: [
    //         { path: '/artist', element: <AccArtistPage/> }
    //     ]
    // },
    // {
    //     element: <GuardAdmin/>,
    //     children: [
    //         { path: '/admin', element: <AdminPage/> }
    //     ]
    // },
]

export default Routes