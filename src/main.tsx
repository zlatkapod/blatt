import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './styles/tokens.css'
import './styles/base.css'
import './styles/app.css'
// Also imported as a string by print/transfer.ts, where it is inlined into
// the exported file. Same source, so preview and export cannot drift.
import './print/sheet.css'

import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
