

export default class ThemeService {
    private currentTheme = "light"
    private autoTheme = false
    
    set theme(theme: string) {
        this.currentTheme = theme
        document.documentElement.setAttribute("data-theme", theme);
    }
    get theme() {
        return this.currentTheme
    }

    getSystemTheme(): string {
        return "dark"
    }

    constructor() {
        // TODO get setting from localstorage
        // TODO media listener
    }
}