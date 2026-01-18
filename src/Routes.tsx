import { BrowserRouter, Routes as ReactRoutes, Route } from 'react-router'
import { HomePage } from './pages/home'
import { ChartPage } from './pages/chart'

export function Routes() {
  return (
    <BrowserRouter>
      <ReactRoutes>
        <Route
          path="/"
          element={<HomePage />}
        />
        <Route
          path="/chart"
          element={<ChartPage />}
        />
      </ReactRoutes>
    </BrowserRouter>
  )
}
