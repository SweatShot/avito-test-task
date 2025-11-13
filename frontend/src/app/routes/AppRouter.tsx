import { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import Routes from "./routes";

export default function AppRouter(){
    return <Suspense fallback={null}>{useRoutes(Routes)}</Suspense>
}