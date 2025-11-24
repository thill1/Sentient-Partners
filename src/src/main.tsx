import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css' // if you don't have this yet, we'll adjust later

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
