import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class HypoServiceMixin extends Vue {
    authKey?: string
    api = "https://api.hypothes.is/api"

    getList(user: string, offset: number, limit: number): Promise<any> {
        const userSeach = `user=${user}`
        const pagination = `offset=${offset}&limit=${limit}`
        const search = `${userSeach}&${pagination}`
        return this.searchHypothesis(search)
    }

    searchHypothesis(search: string): Promise<any> {
        console.debug("search string", search)
        return this.do("GET", `${this.api}/search?${search}`)
            .then(resp => {
                if (!resp.ok) {
                    if (resp.status == 401) {
                        //TODO redirect to login page
                        console.error("Unauthorized")
                        return
                    }
                    console.error("http no ok status", resp.url, resp.status, resp.statusText)
                }
                return resp.json()
            })
    }

    updateAnnotation(annotationId: string, updatePayload: string): Promise<Response> {
        return this.do("PATCH", `${this.api}/annotations/${annotationId}`, updatePayload)
    }

    do(method: string, url: string, payload?: string): Promise<Response> {
        return fetch(url, {
            method: method,
            headers: {
                "Authorization": `Bearer ${this.authKey}`,
                "Content-Type": payload != undefined ? "application/json" : ""
            },
            body: payload != undefined ? payload : undefined
        })
        .catch(err=>{
            console.log(err)
            return err
        })
    }
    created() {
        const authKey = window.localStorage.getItem("authKey")
        if (authKey != null) {
            this.authKey = authKey
        } else {
            console.log("hypothesis auth key not found")
            //TODO remove 
            this.authKey = ""
        }
    }
}