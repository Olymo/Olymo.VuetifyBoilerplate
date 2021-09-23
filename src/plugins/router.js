import Vue from 'vue'
import VueRouter from 'vue-router'
import { isAuthorized, allowedUseCaseIds } from "../util/user";

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject) {
        return originalPush.call(this, location, onResolve, onReject)
    }
    return originalPush.call(this, location).catch((err) => {
        // if (VueRouter.isNavigationFailure(err) && (err.message.includes('Avoided redundant navigation to current location') || err.message.includes('Error: Redirected when going from'))) {
        if (VueRouter.isNavigationFailure(err)) {
            return err
        }
        // rethrow error
        return Promise.reject(err)
    })
}

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'home',
        meta: {
            title: 'Home'
        },
        component: () =>
            import(/* webpackChunkName: "home-page" */ '../components/Home')
    },
    {
        path: '/login',
        name: 'login',
        meta: {
            title: 'Login',
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
        },
        component: () =>
            import(/* webpackChunkName: "register-page" */ '../components/Register'),
        beforeEnter: (_to, _from, next) => {
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
        path: '/products/:id',
        name: 'product',        
        meta: {
            title: 'Product'
        },
        component: () =>
            import(/* webpackChunkName: "product-page" */ '../components/Product')
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
            import(/* webpackChunkName: "checkout-page" */ '../components/Checkout')
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
            import(/* webpackChunkName: "profile-page" */ '../components/Profile')
    },
    {
        path: '/contact',
        name: 'contact',
        meta: {
            title: 'Contact'
        },
        component: () =>
            import(/* webpackChunkName: "contact-page" */ '../components/Contact')
    },
    {
        path: '/logout',
        name: 'logout',
        meta: {
            title: 'Logout'
        },
        component: () =>
            import(/* webpackChunkName: "logout-page" */ '../components/Logout')
    },

    {
        path: '/404',
        name: '404',
        component: () =>
            import(/* webpackChunkName: "not-found-page" */ '../views/NotFound'),
        meta: {
            title: 'Page not found - 404'
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


router.beforeEach((to, _from, next) => {
    const publicPages = [
        'home',
        'login',
        'register',
        '404',
        'products',
        'product',
        'contact'
    ]
    const loggedIn = isAuthorized()    
    const authRequired = !publicPages.includes(to.name)
    if (authRequired && !loggedIn) return next('/login')
    next()
})

router.beforeEach((to, _from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title
    } else {
        document.title = 'Vuetify Boilerplate'
    }

    if (to.name == "admin" || to.params.useCase) {
        if (!allowedUseCaseIds().includes(to.params.useCase)) {
            next('/')
        } else {
            next()
        }
    } else {
        next()
    }
})

export default router
