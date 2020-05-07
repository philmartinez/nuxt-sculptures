export default class Slideshow {

    constructor() {

        this.slideshowEl = document.querySelector('.sculpture-slideshow')

        this.state = {
            activeID: 0
        }

        this.init()
        
    }

    init() {
        this.createMarkup()
    }

    createMarkup() {
        // create.
        this.headingEl = document.createElement('h2')
        this.headingEl.className = 'sculpture-name'
        this.headingElSpan = document.createElement('span')

        // append.
        this.headingEl.appendChild(this.headingElSpan)
        this.slideshowEl.appendChild(this.headingEl)
    }
}