import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Analytics />
      <SpeedInsights />
    </>
  )
}
