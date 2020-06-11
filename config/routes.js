
const routes = [
    {
        path: '/',
        component: '../layouts/BasicLayout',
        authority: ['admin', 'user'],
        routes: [
            {
                path: '/',
                redirect: '/welcome',
            },
            {
                path: '/welcome',
                name: '欢迎',
                icon: 'smile',
                component: './Welcome',
            },
            {
                path: '/admin',
                name: 'admin',
                icon: 'crown',
                component: './Admin',
                authority: ['admin'],
                routes: [
                    {
                        path: '/admin/sub-page',
                        name: 'sub-page',
                        icon: 'smile',
                        component: './Welcome',
                        authority: ['admin'],
                    },
                ],
            },
            {
                name: 'list.table-list',
                icon: 'table',
                path: '/list',
                component: './ListTableList',
            },
            {
                name: 'empty-page',
                icon: 'table',
                path: '/empty',
                component: './EmptyPage',
            },
            {
                component: './404',
            },
        ],
    },
    {
        component: './404',
    },
];

// 获取所有菜单,包含授权
const getMenus = () => {
    return [
        {}
    ]
}

const renderRouter = (routes) => {

    return routes;
}

export default renderRouter(routes);