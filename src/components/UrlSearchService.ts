export default class UrlSearchService  {
    searchString!: string
    search!: Map<string, string>
    get(key: string): string {
        return this.search.get(key) || ""
    }
    set(key: string, value: string, pushHistory?: boolean) {
        this.search.set(key, value)
        this.render()
        if (pushHistory) {
            this.push()
        }
    }
    getSearch(): string {
        return this.searchString
    }
    push() {
        window.history.pushState(this.search, location.pathname + this.searchString)
    }
    render() {
        if (this.search.size == 0) {
            this.searchString = ""
        } else {
            this.searchString = "?"
            for (const [k, v] of this.search) {
                this.searchString += `${k}=${v}&`
            }
            this.searchString = this.searchString.slice(0, this.searchString.length)
        }
    }
    test(){
        console.log("test url search service ")
    }
    constructor(...searchKeys: Array<string>) {
        const search = location.search
        for (const key in searchKeys) {
            const value = search.match(`${key}=([^&]+)`)
            if (value && value.length == 2) {
                this.search.set(key, value[1])
            }
        }
    }
}

// interface UrlSearch {
//     get(key: string): string
//     set(key: string, value: string): undefined
//     getSearch(): string
//     push(): undefined
// }