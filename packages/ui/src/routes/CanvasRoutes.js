import { lazy } from 'react'

// project imports
import Loadable from 'ui-component/loading/Loadable'
import MinimalLayout from 'layout/MinimalLayout'

// canvas routing
const Canvas = Loadable(lazy(() => import('views/canvas')))
const MarketplaceCanvas = Loadable(lazy(() => import('views/marketplaces/MarketplaceCanvas')))
const AppMarketCanvas = Loadable(lazy(() => import('views/appmarket/MarketplaceCanvas')))

// ==============================|| CANVAS ROUTING ||============================== //

const CanvasRoutes = {
    path: '/',
    element: <MinimalLayout />,
    children: [
        {
            path: '/canvas',
            element: <Canvas />
        },
        {
            path: '/canvas/:id',
            element: <Canvas />
        },
        {
            path: '/marketplace/:id',
            element: <MarketplaceCanvas />
        },
        {
            path: '/appmarket/:id',
            element: <AppMarketCanvas />
        }
    ]
}

export default CanvasRoutes
