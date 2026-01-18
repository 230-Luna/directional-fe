import { createRoot } from 'react-dom/client'
import { OverlayProvider } from 'overlay-kit'

import App from './App'

createRoot(document.getElementById('root')!).render(
  <>
    <OverlayProvider>
      <App />
    </OverlayProvider>
  </>
)
