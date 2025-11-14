import { useTheme } from "../context/ThemeContext"

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} style={{ marginLeft: 10, padding: "5px 10px" }}>
      {theme === "light" ? "🌙 Тёмная тема" : "☀️ Светлая тема"}
    </button>
  );
};
