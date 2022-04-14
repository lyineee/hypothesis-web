import Vue, { VueConstructor } from "vue"

export default class Router {
    routes!: Array<Route>
    onRouteChange?: routeChangeFunc

    goto(pathname: string) {
        this.routeChange(pathname)
        history.pushState({}, "", pathname + location.search)
    }

    routeChange(pathname: string) {
        for (const r of this.routes) {
            if (pathname.match(r.regex)) {
                r.callback && r.callback(r)
                this.onRouteChange && this.onRouteChange(r)
                break
            }
        }
    }
    constructor(route: Array<Route>, pathname: string, onRouteChange?: routeChangeFunc) {
        window.onpopstate = () => {
            this.routeChange(location.pathname)
        }
        this.routes = route
        onRouteChange && (this.onRouteChange = onRouteChange)
        this.routeChange(pathname)
    }
}


export interface Route {
    regex: RegExp
    title?: string
    component?: VueConstructor<Vue>
    callback?: routeChangeFunc
}

type routeChangeFunc = (route: Route) => void