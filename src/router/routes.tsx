import type { RouteObject } from 'react-router-dom'

import { Layout } from '../components/Layout'
import { Config } from '../pages/Config'
import { Home } from '../pages/Home'
import { Templates } from '../pages/Templates'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'templates',
        element: <Templates />,
      },
      {
        path: 'config',
        element: <Config />,
      },
    ],
  },
]
