import { BrowserRouter } from "react-router-dom"
import "./App.css"
import AppRouter from "./app/routes/AppRouter"
import { ThemeProvider } from "./context/ThemeContext"
import ThemeToggleButton from "./components/ThemeToggleButton/ThemeToggleButton"
import { ToastProvider } from "./context/ToastContext"
import { ToastContainer } from "./components/Toast/ToastContainer"

export const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <ThemeToggleButton />
          <main>
            <AppRouter />
          </main>
          <ToastContainer />
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
