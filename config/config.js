// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes'
import darkTheme from '@ant-design/dark-theme'
const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: true,
  history: {
    type: 'hash'
  },
  antd: {},
  dva: {
    hmr: true,
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    // default true, when it is true, will use `navigator.language` overwrite default
    antd: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: routes
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
    'black': '#262626',
    'component-background': '#073642',
    'body-background': '#073642',
    'popover-background': '#002b36',
    'background-color-base': '#073642',
    'item-hover-bg': '#586e75',
    'item-active-bg': '#586e75',
    'table-header-bg': '#002b36',
    'modal-content-bg': '#002b36',
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: './',
  },
  publicPath: './'
});
