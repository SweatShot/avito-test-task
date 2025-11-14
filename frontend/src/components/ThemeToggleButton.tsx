import { FC } from "react"
import { useTheme } from "../context/ThemeContext"

const ThemeToggleButton: FC = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      style={{
        position: "fixed",
        top: 10,
        right: 10,
        padding: "6px 12px",
        zIndex: 1000,
        cursor: "pointer",
      }}
    >
      {theme === "light" ? "🌙 Тёмная тема" : "☀️ Светлая тема"}
    </button>
  )
}

export default ThemeToggleButton
