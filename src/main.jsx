import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Google Analytics 4
const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID
if (GA_ID) {
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(script)
  window.dataLayer = window.dataLayer || []
  function gtag() { window.dataLayer.push(arguments) }
  window.gtag = gtag
  gtag('js', new Date())
  gtag('config', GA_ID)
}

// Microsoft Clarity
const CLARITY_ID = import.meta.env.VITE_CLARITY_ID
if (CLARITY_ID) {
  ;(function(c, l, a, r, i, t, y) {
    c[a] = c[a] || function() { (c[a].q = c[a].q || []).push(arguments) }
    t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i
    y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y)
  })(window, document, 'clarity', 'script', CLARITY_ID)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
