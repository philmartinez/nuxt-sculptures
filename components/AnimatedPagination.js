
import gsap from 'gsap'

gsap.defaults({
    ease: "power2.inOut", 
    duration: 1.4
});

export default class AnimatedPagination {
 
    constructor(selector, elToAttach) {

        this.selector = selector
        this.elToAttach = elToAttach

        this.setup()
        this.resize()
        this.bindEvents()
    }
    
    resize() {
        this.elHeight = this.getElHeight('.sculpture-meta .text .inner .name')
    }

    bindEvents() {
        document.addEventListener('resize',() => {
            this.resize()
        })
    }

    setup() {

        this.markup = document.createElement('div')
        this.markup.classList.add('progress')
        this.markup.innerHTML = `
            <span class="number">No.</span>
            <span class="current">
                <span class="inner"></span>
            </span>
            <span class="indicator"><span></span></span>
            <span class="total">${this.slides.length}</span>`
        
        this.els.currentNum = this.markup.querySelector('.current')
        this.els.indicator  = this.markup.querySelector('.current')

        document.querySelector(this.elToAttach).prepend(this.markup)
    }

    getElHeight() {
        let name = document.querySelector(this.selector)
        let nameStyle = window.getComputedStyle(name)

       return name.clientHeight + parseInt(nameStyle.marginBottom)
    }

}