
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
            slideType: document.querySelector('.sculpture-slideshow .sculpture-type'),
            sculptureMetaLinks: document.querySelectorAll('.sculpture-slideshow .sculpture-meta > div'),
            sculptureBGtext: {}
        }

        this.state = {
            activeSlide: 0,
            activeSlideIndex: 0,
            duration: 0,
            prevSlideType: 0,
            changingSlides: false,
        }

        this.setup()
        this.events()
        
    }

    setup() {

        this.slides = this.getSlides()

        this.createMarkup()

        this.changeSlide(0)
        this.state.duration = 1.3
    }

    events() {

        document.addEventListener('click',() => {

            if( !this.state.changingSlides ) {

                if( this.state.activeSlideIndex < this.slides.length - 1 ) {
                    this.state.activeSlideIndex += 1
                } else {
                    this.state.activeSlideIndex = 0
                }

                this.changeSlide(this.state.activeSlideIndex)
            }
            
        })
    }

    createMarkup() {


        // Bg type
        this.els.sculptureType = document.createElement('div');
        this.els.sculptureType.classList.add('sculpture-type')
        this.els.sculptureType.innerHTML = `<span class="grouper">
            <span>G</span>
            <span>r</span>
            <span>o</span>
            <span>u</span>
            <span>p</span>
            <span>e</span>
            <span>r</span>
        </span>
        <span class="snapper">
            <span>S</span>
            <span>n</span>
            <span>a</span>
            <span>p</span>
            <span>p</span>
            <span>e</span>
            <span>r</span>
        </span>
        <span class="whale">
            <span>B</span>
            <span>o</span>
            <span>w</span>
            <span>h</span>
            <span>e</span>
            <span>a</span>
            <span>d</span>
        </span>`

        // Cache els.
        this.els.sculptureBGtext.whale   = this.els.sculptureType.querySelector('.whale')
        this.els.sculptureBGtext.grouper = this.els.sculptureType.querySelector('.grouper')
        this.els.sculptureBGtext.snapper = this.els.sculptureType.querySelector('.snapper')

        // Append els.
        this.els.parent.appendChild(this.els.sculptureType)

    }


    changeSlide(index) {

        this.state.activeSlide = this.slides[index]

        this.updateSculptureColors()
        this.updateSculptureText()

        this.state.changingSlides = true
        setTimeout( () => { this.state.changingSlides = false }, 1500 )
    }

    updateSculptureText() {

        let tl = gsap.timeline()
        let duration = this.state.duration === 0 ? 0 : '0.8'

        // BG Text.
        if( this.state.prevSlideType !== this.state.activeSlide.type ) {

            // Out.
            if( this.state.prevSlideType !== 0 ) {

                let typeOut = this.els.sculptureBGtext[this.state.prevSlideType]

                tl.fromTo(typeOut.querySelectorAll('span'), {
                    opacity: 1,
                    rotateY: 0,
                    y: '0vh'
                },{
                    opacity: 0,
                    rotateY: -25,
                    y: '-20vh',
                    stagger: 0.03,
                    duration: duration,
                    ease: "power1.in"
                })

            }

            // In.
            let typeIn = this.els.sculptureBGtext[this.state.activeSlide.type]
            
            tl.fromTo(typeIn.querySelectorAll('span'), {
                opacity: 0,
                rotateY: 25,
                y: '20vh'
            },{
                opacity: 1,
                rotateY: 0,
                y: '0vh',
                stagger: 0.03,
                duration: duration,
                ease: "power2.out"
            },'-=0.1')

        }

  
        // Store previous type
        this.state.prevSlideType = this.state.activeSlide.type


        // Bottom Meta
        let meta_tl = gsap.timeline()
        this.els.sculptureMetaLinks.forEach((el) => {

             let nameText = el.querySelector('.name').textContent
             let nameEl   = el.querySelector('.name-link')

             if( nameText === this.state.activeSlide.name ) {
                
                el.classList.add('active')
                meta_tl.to( nameEl, {
                    y: 0,
                    opacity: 1,
                    duration: '0.4'
                })

            } else {
                
                el.classList.remove('active')
                meta_tl.to( nameEl, {
                    y: -20,
                    opacity: 0,
                    duration: '0.4'
                },'-=0.2')

           }
       

        })

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


    getSlides() {
        
        let arrEls = Array.from(this.els.slides);

        return arrEls.map((el,i) => {

            let title = el.querySelector('h2').textContent

            // grabbing the attrs from actual json to avoid using any data attrs in dom
            let currentItem = this.items.filter((el) => {
                return el.name === title
            });

            let { font_color, bg_color, type } = currentItem[0]
            

            return {
                el: el,
                index: i,
                name: title,
                type: type,
                font_color: font_color,
                bg_color: bg_color
            }
        })
    }

}