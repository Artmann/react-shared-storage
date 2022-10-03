import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './app'

(function main() {
  const element = document.getElementById('root')

  if (!element) {
    throw new Error('No root element found.')
  }

  const root = createRoot(element)

  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  )
})()