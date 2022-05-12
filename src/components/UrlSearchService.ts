/*
    data from `address bar` and program all through `set()` api, and
    save to map `search`. 
    
    Which means the map `search` is the source of truth.
*/
export default class UrlSearchService {
    searchString = ""
    search: Map<string, string> = new Map()
    searchKey!: Array<string>
    watchList: Array<{ key?: string, callback: watchCallback }> = []
    popstateWatchList: Array<(ev: PopStateEvent, search: Map<string, string>) => void> = []

    get(key: string): string {
        return this.search.get(key) || ""
    }

    set(key: string, value: string, pushHistory?: boolean) {
        if (this.search.get(key) === value) {
            return
        }
        this.search.set(key, value)
        // trigger callback
        for (const watcher of this.watchList) {
            if (!watcher.key || watcher.key === key) {
                watcher.callback(this.search, watcher.key ? value : "")
            }
        }
        this.render() // render to address bar
        if (pushHistory) {
            this.push()
        }
    }

    getSearch(): string {
        return this.searchString
    }

    push() {
        window.history.pushState(this.search, "", location.pathname + this.searchString)
    }

    watch(callback: watchCallback, key?: string) {
        this.watchList.push({
            key: key,
            callback: callback
        })
    }

    onPopstate(fn: (ev: PopStateEvent, search: Map<string, string>) => void) {
        this.popstateWatchList.push(fn)
    }

    // render map search to address bar
    render() {
        if (this.search.size == 0) {
            this.searchString = ""
        } else {
            this.searchString = "?"
            for (const [k, v] of this.search) {
                this.searchString += `${k}=${v}&`
            }
            this.searchString = this.searchString.slice(0, this.searchString.length - 1)
        }
    }

    refresh(searchKeys: Array<string>, search: string) {
        if (!searchKeys) {
            searchKeys = this.searchKey
        }
        for (const key of searchKeys) {
            const value = search.match(`${key}=([^&]+)`)
            if (value && value.length == 2) {
                this.set(key, value[1])
            }
        }
    }

    constructor(searchKeys: Array<string>, searchString?: string) {
        this.searchKey = searchKeys
        this.refresh(searchKeys, searchString ? searchString : location.search)
        window.addEventListener("popstate", (ev) => {
            this.refresh(this.searchKey, location.search)
            for (const fn of this.popstateWatchList) {
                fn(ev, this.search)
            }
        })
    }
}

type watchCallback = (para: Map<string, string>, v?: string) => void
