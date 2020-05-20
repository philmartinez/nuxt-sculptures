export default class App {

    constructor() {
        this.resize()
        window.addEventListener('resize', () => { this.resize() })
    }

    resize() {
        this.winH = window.innerHeight
        this.winW = window.innerWidth
    }
} 