import Vue from 'vue'
import VueRouter from 'vue-router'
import { isAuthorized, getActorData } from "../util/user";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'home',
        // beforeEnter: (to, from, next) => {
        //     next({ path: '/products' })
        // }
        meta: {
            title: 'Home'
        },
        component: () =>
            import(/* webpackChunkName: "products-page" */ '../components/Home')
    },
    {
        path: '/login',
        name: 'login',
        meta: {
            title: 'Login',
            // layout: 'no-navigation'
        },
        component: () =>
            import(/* webpackChunkName: "login-page" */ '../components/Login'),
        beforeEnter: (to, from, next) => {
            if (isAuthorized()) {
                next({ name: 'home' })
            } else {
                next()
            }
        }
    },
    {
        path: '/register',
        name: 'register',
        meta: {
            title: 'Register',
            // layout: 'no-navigation'
        },
        component: () =>
            import(/* webpackChunkName: "register-page" */ '../components/Register'),
        beforeEnter: (to, from, next) => {
            if (isAuthorized()) {
                next({ name: 'home' })
            } else {
                next()
            }
        }
    },
    {
        path: '/admin/:page',
        name: 'admin',
        props: true,
        meta: {
            title: 'Admin'
        },
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
        path: '/profile',
        name: 'profile',
        meta: {
            title: 'Profile'
        },
        component: () =>
            import(/* webpackChunkName: "orders-page" */ '../components/Profile')
    },
    {
        path: '/contact',
        name: 'contact',
        meta: {
            title: 'Contact'
        },
        component: () =>
            import(/* webpackChunkName: "orders-page" */ '../components/Contact')
    },
    {
        path: '/logout',
        name: 'logout',
        meta: {
            title: 'Logout'
        },
        component: () =>
            import(/* webpackChunkName: "orders-page" */ '../components/Logout')
    },

    {
        path: '/404',
        name: '404',
        component: () =>
            import(/* webpackChunkName: "not-found-page" */ '../views/NotFound'),
        // props: true,
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
    const publicPages = [
        '/',
        '/login',
        '/register',
        '/404',
        '/products',
        '/contact'
    ]
    const loggedIn = isAuthorized()
    const authRequired = !publicPages.includes(to.path)
    if (authRequired && !loggedIn) return next('/login')
    next()
})

router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title
    } else {
        document.title = 'Vuetify Boilerplate'
    }

    let allowedUseCaseIds = []
    let actor = getActorData();


    if (actor != null) {
        allowedUseCaseIds = actor.AllowedUseCaseIds
    }

    if (to.params.useCase) {
        if (!allowedUseCaseIds.includes(to.params.useCase)) {
            next('/')
        } else {
            next()
        }
    } else {
        next()
    }
})

export default router

