

export default class KeyboardService {
    private registryMap: Array<keyHandler> = []

    register(key: string, handler: handleFn, option?: registerOption) {
        const handle: keyHandler = {
            key: key,
            handler: (() => {
                return (e?: KeyboardEvent) => {
                    !!option?.preventDefault && e?.preventDefault()
                    handler(e)
                }
            })(),
            target: option?.target || document.body,
            withKey: option?.withKey
        }
        // TODO deduplicate keyHandler
        this.registryMap.push(handle)
    }

    eventHandler(e: KeyboardEvent) {
        for (const handler of this.registryMap) {
            if (handler.key == e.key && handler.target == e.target) {
                if (handler.withKey) {
                    switch (handler.withKey) {
                        case WithKey.alt:
                            if (e.altKey) {
                                handler.handler(e)
                            }
                            break
                        case WithKey.ctrl:
                            if (e.ctrlKey) {
                                handler.handler(e)
                            }
                            break
                        case WithKey.shift:
                            if (e.shiftKey) {
                                handler.handler(e)
                            }
                            break
                    }
                } else {
                    handler.handler(e)
                }

            }
        }
    }
    constructor() {
        document.body.onkeydown = (e) => { this.eventHandler(e) }
    }
}

export enum WithKey {
    alt = 1,
    shift,
    ctrl
}

type handleFn = (e?: KeyboardEvent) => void

interface keyHandler extends registerOption {
    key: string
    handler: handleFn
    target: HTMLElement
}


export interface registerOption {
    withKey?: WithKey
    target?: HTMLElement
    preventDefault?: boolean
}