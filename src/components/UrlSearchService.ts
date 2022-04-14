export default class UrlSearchService {
    searchString = ""
    search: Map<string, string> = new Map()
    searchKey!: Array<string>

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
        window.history.pushState(this.search, "", location.pathname + this.searchString)
    }

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
                this.search.set(key, value[1])
            }
        }
    }

    constructor(searchKeys: Array<string>, searchString?: string) {
        this.searchKey = searchKeys
        this.refresh(searchKeys, searchString ? searchString : location.search)
    }
}
