// assets
import { IconHierarchy, IconBuildingStore, IconKey, IconTool, IconBuildingFactory2, IconBabyCarriage } from '@tabler/icons'

// constant
const icons = { IconHierarchy, IconBuildingStore, IconKey, IconTool, IconBuildingFactory2, IconBabyCarriage }

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
    id: 'dashboard',
    title: '',
    type: 'group',
    children: [
        {
            id: 'appmarket',
            title: '应用市场',
            type: 'item',
            url: '/appmarket',
            icon: icons.IconBuildingStore,
            breadcrumbs: true
        },
        {
            id: 'myapp',
            title: '我的应用',
            type: 'item',
            url: '/myapp',
            icon: icons.IconBabyCarriage,
            breadcrumbs: true
        },
        {
            id: 'chatflows',
            title: '应用定制',
            type: 'item',
            url: '/chatflows',
            icon: icons.IconHierarchy,
            breadcrumbs: true
        },
        {
            id: 'marketplaces',
            title: '定制模版',
            type: 'item',
            url: '/marketplaces',
            icon: icons.IconBuildingFactory2,
            breadcrumbs: true
        },
        {
            id: 'tools',
            title: '工具定制',
            type: 'item',
            url: '/tools',
            icon: icons.IconTool,
            breadcrumbs: true
        },
        {
            id: 'apikey',
            title: '集成管理',
            type: 'item',
            url: '/apikey',
            icon: icons.IconKey,
            breadcrumbs: true
        }
    ]
}

export default dashboard
