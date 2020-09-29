export default [
  {
    path: '/',
    redirect: {
      name: 'ticket-list'
    },
    component: () => import(/* webpackChunkName: "ticket" */ '@/views/pages/index.vue'),
    children: [
      {
        name: 'ticket-list',
        path: '/list/:type?',
        component: () => import(/* webpackChunkName: "ticket" */ '@/views/pages/ticket/list')
      },
      {
        name: 'ticket-template',
        path: '/template',
        component: () => import(/* webpackChunkName: "ticket" */ '@/views/pages/ticket/template')
      },
      {
        name: 'ticket-apply',
        path: '/apply',
        component: () => import(/* webpackChunkName: "ticket" */ '@/views/pages/ticket/apply')
      },
      {
        name: 'ticket-create',
        path: '/apply/:templateKey/',
        component: () => import(/* webpackChunkName: "ticket" */ '@/views/pages/ticket/apply/create')
      },
      {
        name: 'ticket-details',
        path: '/details/:id',
        component: () => import(/* webpackChunkName: "ticket" */ '@/views/pages/ticket/list/details')
      },
      {
        name: 'template-editor',
        path: '/template/editor/:key?',
        redirect: {
          name: 'template-editor-info'
        },
        component: () => import(/* webpackChunkName: "ticket" */ '@/views/pages/ticket/template/editor'),
        children: [{
          path: 'info',
          name: 'template-editor-info',
          component: () => import(/* webpackChunkName: "ticket" */ '@/views/pages/ticket/template/editor/info'),
        }, {
          path: 'content',
          name: 'template-editor-content',
          component: () => import(/* webpackChunkName: "ticket" */ '@/views/pages/ticket/template/editor/content'),
        }, {
          path: 'flow',
          name: 'template-editor-flow',
          component: () => import(/* webpackChunkName: "ticket" */ '@/views/pages/ticket/template/editor/flow'),
        }]
      }
    ]
  },
  {
    path: '/404',
    name: 'notfound',
    component: () => import('@/shared/components/page-status/notfound.vue'),
  },
  {
    path: '/400',
    component: () => import('@/shared/components/page-status/internal-error.vue'),
  },
  {
    path: '/500',
    component: () => import('@/shared/components/page-status/no-permission.vue'),
  },
  {
    path: '/503',
    component: () => import('@/shared/components/page-status/system-maintenance.vue'),
  },
  {
    path: '*',
    component: () => import('@/shared/components/page-status/notfound.vue'),
  }
];
