import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";

const ListPage = lazy(() => import('../../pages/ListPage/ListPage'));
const ItemPage = lazy(() => import('../../pages/ItemPage/ItemPage'));
const StatsPage = lazy(() => import('../../pages/StatsPage/StatsPage')); 

const Routes: RouteObject[] = [
  { path: "/", element: <Navigate to="/list" replace /> },
  { path: "/list", element: <ListPage /> },
  { path: "/item/:id", element: <ItemPage /> },
  { path: "/stats", element: <StatsPage /> }, 
];

export default Routes;
