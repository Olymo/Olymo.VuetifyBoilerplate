import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'home',
        beforeEnter: (to, from, next) => {
            next({ path: '/login' })
        }
    },
    {
        path: '/login',
        name: 'login',
        meta: {
            title: 'Login',
            layout: 'no-navigation'
        },
        component: () =>
            import(/* webpackChunkName: "login-page" */ '../components/Login')
    },
    {
        path: '/register',
        name: 'register',
        meta: {
            title: 'Register',
            layout: 'no-navigation'
        },
        component: () =>            
            import(/* webpackChunkName: "register-page" */ '../components/Register')
    },
    {
        path: '/admin/:page',
        name: 'admin',
        meta: {
            title: 'Admin'
        },
        props: true,
        component: () =>
          import(/* webpackChunkName: "admin-page" */ '../components/rest-crud/RestCrudPage')
      },
    {
        path: '/products',
        name: 'products',
        meta: {
            title: 'Products'
        },
        component: () =>
            import(/* webpackChunkName: "products-page" */ '../components/Products')
    },    
    {
        path: '/cart',
        name: 'cart',
        meta: {
            title: 'Cart'
        },
        component: () =>
            import(/* webpackChunkName: "cart-page" */ '../components/Cart')
    },
    {
        path: '/checkout',
        name: 'checkout',
        meta: {
            title: 'Checkout'
        },
        component: () =>
            import(/* webpackChunkName: "cart-page" */ '../components/Checkout')
    },
    {
        path: '/orders',
        name: 'orders',
        meta: {
            title: 'Orders'
        },
        component: () =>
            import(/* webpackChunkName: "orders-page" */ '../components/Orders')
    },

    {
        path: '/404',
        name: '404',
        component: () =>        
          import(/* webpackChunkName: "not-found-page" */ '../views/NotFound'),
        props: true,
        meta: {
          title: 'Page not found - 404',
          layout: 'no-navigation'
        }
      },
      {
        path: '*',
        redirect: { name: '404', params: { resource: 'page' } }
      }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title
    } else {
        document.title = 'Vuetify Boilerplate'
    }
    next()
})

export default router
