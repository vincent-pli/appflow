import { lazy } from 'react'

// project imports
import MainLayout from 'layout/MainLayout'
import Loadable from 'ui-component/loading/Loadable'

// marketplaces routing
const Appmarket = Loadable(lazy(() => import('views/appmarket')))

// myapp routing
const Myapp = Loadable(lazy(() => import('views/myapp')))

// chatflows routing
const Chatflows = Loadable(lazy(() => import('views/chatflows')))

// marketplaces routing
const Marketplaces = Loadable(lazy(() => import('views/marketplaces')))

// apikey routing
const APIKey = Loadable(lazy(() => import('views/apikey')))

// apikey routing
const Tools = Loadable(lazy(() => import('views/tools')))

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/',
            element: <Chatflows />
        },
        {
            path: '/appmarket',
            element: <Appmarket />
        },
        {
            path: '/myapp',
            element: <Myapp />
        },
        {
            path: '/chatflows',
            element: <Chatflows />
        },
        {
            path: '/marketplaces',
            element: <Marketplaces />
        },
        {
            path: '/apikey',
            element: <APIKey />
        },
        {
            path: '/tools',
            element: <Tools />
        }
    ]
}

export default MainRoutes
