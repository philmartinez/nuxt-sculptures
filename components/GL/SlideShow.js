import * as THREE from 'three'
import gsap from 'gsap'
import Fish from '~/components/GL/Fish.js'

gsap.defaults({
    ease: "power2.inOut", 
    duration: 1.1
});

export default class Slideshow {

    constructor(items) {


        // Data
        this.items = items

        // DOM
        this.els = {
            parent: document.querySelector('.sculpture-slideshow'),
            slides: document.querySelectorAll('.sculpture-slideshow .sculpture'),
            slideSizer: document.querySelector('.sculpture-slideshow .sculptures .img-wrap'),
            slideType: document.querySelector('.sculpture-slideshow .sculpture-type'),
            sculptureMetaLinks: Array.from(document.querySelectorAll('.sculpture-slideshow .sculpture-meta .link a')),
            sculptureMetaName: document.querySelector('.sculpture-slideshow .sculpture-meta .name-wrap .inner .name'),
            sculptureBGtext: {},
            sculptureTracking: {}
        }

        // GL
        this.GLscene = APP.Scene
        this.Fish = new Fish()
        this.Fish.init(this.els.slideSizer, this.els.parent)

        // State
        this.state = {
            activeSlide: 0,
            activeSlideIndex: 0,
            prevSlideIndex: -1,
            prevSlideType: 0,
            duration: 0,
            changingSlides: false,
            direction: 'down'
        }


        this.setup()
        this.events()
        
    }

    setup() {

        // Store
        this.slides = this.getSlides()

        // DOM
        this.createMarkup()

        // Start the slider
        this.state.prevSlideType = this.slides[0].type
        this.changeSlide(0)
        this.state.duration = 1.1
    }

    events() {

        document.addEventListener('wheel', (e) => {

            if( this.state.changingSlides ) return
            
            // next
            if( e.deltaY > 0 ) {

                this.state.direction = 'down'
                if( this.state.activeSlideIndex < this.slides.length - 1 ) {
                    this.state.activeSlideIndex++
                } else {
                    this.state.activeSlideIndex = 0
                }
                
            } 
            // prev
            else {
                
                this.state.direction = 'up'
                if( this.state.activeSlideIndex != 0) {
                    this.state.activeSlideIndex--
                } else {
                    this.state.activeSlideIndex = this.slides.length - 1
                }
    
            }

            this.changeSlide(this.state.activeSlideIndex)

            this.state.prevSlideIndex = this.state.activeSlideIndex
        })

        document.addEventListener('resize',() => {
            
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
        <span class="bowhead">
            <span>B</span>
            <span>o</span>
            <span>w</span>
            <span>h</span>
            <span>e</span>
            <span>a</span>
            <span>d</span>
        </span>`

        // Total count
        let totalMarkup = document.createElement('div')
        totalMarkup.classList.add('progress')
        totalMarkup.innerHTML = `
            <span class="number">No.</span>
            <span class="current">
                <span class="inner">1</span>
            </span>
            <span class="indicator"><span></span></span>
            <span class="total">${this.slides.length}</span>`

        // Cache els.
        this.els.sculptureBGtext.bowhead   = this.els.sculptureType.querySelector('.bowhead')
        this.els.sculptureBGtext.grouper = this.els.sculptureType.querySelector('.grouper')
        this.els.sculptureBGtext.snapper = this.els.sculptureType.querySelector('.snapper')


        // Append els.
        this.els.parent.appendChild(this.els.sculptureType)
        this.els.parent.querySelector('.sculpture-meta').prepend(totalMarkup)
        this.els.sculptureTracking.number = this.els.parent.querySelector('.current .inner')
        this.els.sculptureTracking.indicator   = this.els.parent.querySelector('.indicator span')

    }


    changeSlide(index) {

        // DOM
        this.state.activeSlide = this.slides[index]

        this.updateSculptureColors()
        this.updateSculptureText(index)
        this.updateSculptureLink()

        // GL
        this.Fish.switchTextures(index)

        // State
        this.state.changingSlides = true
        setTimeout( () => { this.state.changingSlides = false }, 1250 )
    }

    
    updateSculptureText(index) {

        let tl = gsap.timeline()
        let duration = this.state.duration === 0 ? 0 : '1'


        // BG Text.
        let typeOut = this.els.sculptureBGtext[this.state.prevSlideType]
        let typeIn = this.els.sculptureBGtext[this.state.activeSlide.type]
        
        //// Out.
        tl.fromTo(typeOut.querySelectorAll('span'), {
            opacity: 1,
            rotateX: 0,
            z: 0,
            y: '0vh'
        },{
            rotateX: this.state.direction == 'down' ? 90 : -90,
            y: this.state.direction == 'down' ? '-20vh' : '20vh',
            z: -800,
            stagger: 0.02,
            duration: duration,
            ease: "power1.outIn"
        })

        //// In.
        tl.fromTo(typeIn.querySelectorAll('span'), {
            rotateX: this.state.direction == 'down' ? -90 : 90,
            y: this.state.direction == 'down' ? '20vh' : '-20vh',
            z: -800
        },{
            opacity: 1,
            rotateX: 0,
            y: '0vh',
            z: 0,
            stagger: 0.02,
            duration: duration,
            ease: "power1.outIn"
        },'-=1')


        // Bottom Meta Name
        this.updateVerticalOverflowSelection(this.els.sculptureMetaName, () => {
            this.els.sculptureMetaName.innerHTML = `${this.state.activeSlide.type} ${this.state.activeSlide.name}`
        })
        
        // Tracking Number
        this.updateVerticalOverflowSelection(this.els.sculptureTracking.number, () => {
            this.els.sculptureTracking.number.innerHTML = index + 1
        })


        // Store previous type
        this.state.prevSlideType = this.state.activeSlide.type
        

     }


     updateVerticalOverflowSelection(el, callback) {

        let nameTL = gsap.timeline()
        let duration = this.state.duration === 0 ? 0 : 0.52
        
        nameTL.pause()
        
        nameTL.fromTo(el,{
            y: '0%'
        }, {
            y: this.state.direction == 'down' ? '-100%' : '100%',
            ease: "power1.in",
            duration: duration
        })
        nameTL.call(callback)
        nameTL.fromTo(el,{
            y: this.state.direction == 'down' ? '100%' : '-100%'
        }, {
            y: '0%',
            ease: "power1.out",
            duration: duration
        })

        nameTL.play()
     }

     updateSculptureLink() {

        this.els.sculptureMetaLinks.forEach((el, index) => {
            if( index === this.state.activeSlideIndex) {
                this.els.sculptureMetaLinks[index].classList.add('active')
            } else {
                this.els.sculptureMetaLinks[index].classList.remove('active')
            }
        })
     }
 
     updateSculptureColors() {
 
         let { font_color, bg_color } = this.state.activeSlide
 
         gsap.to(this.els.parent, {
             backgroundColor: bg_color,
             duration: this.state.duration
         })
         /*
         gsap.to(this.els.sculptureType, {
             color: font_color,
             duration: this.state.duration
         })*/
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