import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Initialize dark mode from localStorage or system preference
const savedDarkMode = localStorage.getItem('darkMode');
if (savedDarkMode !== null) {
  if (JSON.parse(savedDarkMode)) {
    document.documentElement.classList.add('dark');
  }
} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.documentElement.classList.add('dark');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
