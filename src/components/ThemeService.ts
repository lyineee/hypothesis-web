

export default class ThemeService {
    private currentTheme: ThemeString = "light"
    private systemTheme!: ThemeString
    private setting!: ThemeSetting
    private darkQuery!: MediaQueryList
    private settingStore = "themeSetting"

    private set theme(theme: ThemeString) {
        this.currentTheme = theme
        document.documentElement.setAttribute("data-theme", theme);
    }
    get theme() {
        return this.currentTheme as ThemeString
    }

    auto() {
        this.setTheme()
    }

    // user set theme
    setTheme(theme?: ThemeString) {
        if (theme) {
            this.theme = theme
            this.setting.theme = theme
        } else {
            this.setting.theme = undefined
            this.systemTheme = this.theme = this.darkQuery.matches ? "dark" : "light"
        }
        this.updateSetting()
    }

    getTheme(): ThemeString {
        return this.currentTheme
    }

    getSystemTheme(): string {
        return this.systemTheme
    }

    getSetting() {
        return this.setting
    }

    private updateSetting() {
        localStorage.setItem(this.settingStore, JSON.stringify(this.setting))
    }

    private onQueryChange(this: ThemeService, ev: MediaQueryListEvent) {
        this.systemTheme = ev.matches ? "dark" : "light"
        if (!this.setting.theme) {
            this.theme = this.systemTheme
        }
    }

    constructor() {
        const setting = localStorage.getItem(this.settingStore)
        if (setting) {
            this.setting = JSON.parse(setting)
        } else {
            this.setting = {}
        }
        this.darkQuery = window.matchMedia('(prefers-color-scheme: dark)')
        this.setTheme(this.setting.theme)
        this.darkQuery.addEventListener("change", this.onQueryChange.bind(this))
    }
}

interface ThemeSetting {
    theme?: ThemeString
}

type ThemeString = "light" | "dark"