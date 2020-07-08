export default class App {

    constructor() {
        this.state = {
            view: 'slider',
            fish: 0
        }
        this.onMobile = false;
        this.resize()
        window.addEventListener('resize', () => { this.resize() })
    }

    resize() {
        this.winH = window.innerHeight
        this.winW = window.innerWidth

        this.onMobile = false
        if( this.winW < 1000 ) {
            this.onMobile = true
        }
    }
} 