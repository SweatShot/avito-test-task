import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";

const ListPage = lazy(() => import('../../pages/ListPage/ListPage'));
const ItemPage = lazy(() => import('../../pages/ItemPage/ItemPage')); // добавляем

const Routes: RouteObject[] = [
  { path: "/", element: <Navigate to="/list" replace /> },
  { path: "/list", element: <ListPage /> },
  { path: "/item/:id", element: <ItemPage /> }, // маршрут для детального просмотра
];

export default Routes;
