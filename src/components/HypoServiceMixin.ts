import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class HypoServiceMixin extends Vue {
    authKey?: string
    api = "https://api.hypothes.is/api"

    getList(user: string, offset: number, limit: number): Promise<searchResponseJson> {
        return this.searchAnno(offset, limit, user, this.getToken())
    }

    searchAnno(offset: number, limit: number, user?: string, token?: string, any?: string, tags?: Array<string>, quote?: string, text?: string, url?: string) {
        const userSeach = `${user ? "&user=" + user : ""}`
        const pagination = `offset=${offset}&limit=${limit}`
        const searchPart = `${any ? "&any=" + any : ""}${tags ? "&tags=" + tags : ""}${quote ? "&quote=" + quote : ""}${text ? "&text=" + text : ""}${url ? "&url=" + url : ""}`
        const search = `${pagination}${userSeach}${searchPart}`
        return this.searchHypothesis(search, token)
    }

    searchHypothesis(search: string, token?: string): Promise<searchResponseJson> {
        return this.do("GET", `${this.api}/search?${search}`, undefined, token)
            .then(resp => {
                if (!resp.ok) {
                    console.error("http no ok status", resp.url, resp.status, resp.statusText)
                }
                return resp.json()
            })
    }

    updateAnnotation(annotationId: string, updatePayload: string): Promise<Response> {
        return this.do("PATCH", `${this.api}/annotations/${annotationId}`, updatePayload, this.getToken())
    }

    getProfile(token: string): Promise<UserProfile> {
        return this.do("GET", `${this.api}/profile`, undefined, token)
            .then(resp => {
                if (!resp.ok) {
                    console.error(resp.statusText);
                }
                return resp.json()
            })
    }
    do(method: string, url: string, payload?: string, token?: string): Promise<Response> {
        return fetch(url, {
            method: method,
            headers: {
                "Authorization": token ? `Bearer ${token}` : "",
                "Content-Type": payload != undefined ? "application/json" : ""
            },
            body: payload != undefined ? payload : undefined
        })
            .then(resp => {
                if (resp.status == 401) { // unauthorize 
                    location.pathname = "/login"
                }
                return resp
            })
            .catch(err => {
                console.log(err)
                return err
            })
    }
    getToken(): string | undefined {
        return this.authKey
    }
    getUser(): string {
        const user = window.localStorage.getItem("user")
        if (user) {
            return user
        }
        return ""
    }
    created() {
        this.authKey = window.localStorage.getItem("authKey") as string
    }
}


export interface Annotation {
    id: string,
    created: string,
    updated: string,
    user: string,
    uri: string,
    text: string,
    tags: Array<string>,
    group: string,
    permissions: {
        read: Array<string>,
        admin: Array<string>,
        update: Array<string>,
        delete: Array<string>,
    },
    target: [
        {
            source: string,
            selector?: [
                {
                    type: string,
                    endOffset: number,
                    startOffset: number,
                    endContainer: string,
                    startContainer: string,
                }, {
                    end: number,
                    type: string,
                    start: number,
                }, {
                    type: string,
                    exact: string,
                    prefix: string,
                    suffix: string,
                }

            ],

        }
    ],
    document: {
        title: Array<string>
    }
    links: {
        html: string,
        incontext: string,
        json: string,
    },
    user_info: {
        display_name: string | null
    },
    flagged: boolean,
    hidden: boolean,
}

export interface searchResponseJson {
    total: number,
    rows: Array<Annotation>,
}

export interface Group {
    name: string;
    id: string;
    public: boolean;
    url?: string;
}
export interface UserProfile {
    userid: string | null;
    authority: string;
    groups: Array<Group>;
    features: {
        notebook_launch: boolean;
        embed_cachebuster: boolean;
        client_display_names: boolean;
    };
    preferences: any;
    user_info: {
        display_name: null | string;
    };
}