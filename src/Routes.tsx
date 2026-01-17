import { BrowserRouter, Routes as ReactRoutes, Route } from 'react-router'
import { HomePage } from './pages/home'

export function Routes() {
  return (
    <BrowserRouter>
      <ReactRoutes>
        <Route
          path="/"
          element={<HomePage />}
        />
      </ReactRoutes>
    </BrowserRouter>
  )
}
