import { BrowserRouter } from "react-router-dom"
import "./App.css"
import AppRouter from "./app/routes/AppRouter"

export const App = () => {
  return (
    <BrowserRouter>
      <main>
        <AppRouter />
      </main>
    </BrowserRouter>
  )
}
