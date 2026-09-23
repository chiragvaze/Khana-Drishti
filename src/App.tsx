import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'

import { StartupIntro } from './components/ui/StartupIntro'

export default function App() {
  return (
    <>
      <StartupIntro />
      <RouterProvider router={router} />
      <Analytics />
      <SpeedInsights />
    </>
  )
}
