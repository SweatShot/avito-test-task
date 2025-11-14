import { BrowserRouter } from "react-router-dom"
import "./App.css"
import AppRouter from "./app/routes/AppRouter"
import { ThemeProvider } from "./context/ThemeContext"
import ThemeToggleButton from "./components/ThemeToggleButton/ThemeToggleButton"

export const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ThemeToggleButton />
        <main>
          <AppRouter />
        </main>
      </ThemeProvider>
    </BrowserRouter>
  )
}
