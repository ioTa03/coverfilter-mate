
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { migrateDataToSupabase } from './scripts/migrateData.ts'

// Make migration function available globally in development mode
if (import.meta.env.DEV) {
  (window as any).migrateDataToSupabase = migrateDataToSupabase;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
