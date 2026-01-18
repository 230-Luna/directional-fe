import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Routes } from './Routes'
import { css, Global } from '@emotion/react'
import reset from 'emotion-reset'
import { OverlayProvider } from 'overlay-kit'

const queryClient = new QueryClient()

export default function App() {
  return (
    <>
      <Global
        styles={css`
          ${reset}
        `}
      />
      <QueryClientProvider client={queryClient}>
        <OverlayProvider>
          <Routes />
        </OverlayProvider>
      </QueryClientProvider>
    </>
  )
}
