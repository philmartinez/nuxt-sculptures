
import gsap from 'gsap'

gsap.defaults({
    ease: "power2.inOut", 
    duration: 1.5
});

export default class Slideshow {

    constructor(scene, items) {

        this.scene = scene

        this.items = items

        this.els = {
            parent: document.querySelector('.sculpture-slideshow'),
            slides: document.querySelectorAll('.sculpture-slideshow .sculpture'),
            slideType: document.querySelector('.sculpture-slideshow .sculpture-type')
        }

        this.state = {
            activeSlide: 0,
            duration: 0
        }

        this.setup()
        
    }

    setup() {

        this.slides = this.getSlides()

        this.createMarkup()

        this.changeSlide(0)
        this.state.duration = 1.5
    }

    createMarkup() {

        // create.
        this.els.headingEl = document.createElement('h2')
        this.els.headingEl.classList.add('sculpture-name')

        this.els.headingElSpan = document.createElement('span')

        this.els.sculptureType = document.createElement('div');
        this.els.sculptureType.classList.add('sculpture-type')
        this.els.sculptureType.innerHTML = `<span class="fish">
            <span class="left">Fi</span>
            <span class="right">sh</span>
        </span>
        <span class="whale">
            <span class="left">Wh</span>
            <span class="right">ale</span>
        </span>`

        
        // append.
        this.els.headingEl.appendChild(this.els.headingElSpan)
        this.els.parent.appendChild(this.els.headingEl)
        this.els.parent.appendChild(this.els.sculptureType)

    }

    updateSculptureType() {

       switch(this.state.activeSlide.type) {
        case '':
            break
       }

    }

    updateSculptureColors() {

        let { font_color, bg_color } = this.state.activeSlide

        gsap.to(this.els.parent, {
            backgroundColor: bg_color,
            duration: this.state.duration
        })
        gsap.to(this.els.sculptureType, {
            color: font_color,
            duration: this.state.duration
        })
    }

    changeSlide(index) {

        this.state.activeSlide = this.slides[index]

        this.updateSculptureColors()
    }


    getSlides() {
        
        let arrEls = Array.from(this.els.slides);

        return arrEls.map((el,i) => {

            let title = el.querySelector('h2').textContent

            // grabbing the colors from actual json to avoid using any data attrs in dom
            let item = this.items.filter((el) => {
                return el.name === title
            });

            return {
                el: el,
                index: i,
                title: title,
                type: el.querySelector('.type').textContent,
                font_color: item[0].font_color,
                bg_color: item[0].bg_color
            }
        })
    }

}