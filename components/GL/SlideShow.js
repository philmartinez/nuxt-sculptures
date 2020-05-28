import * as THREE from 'three'
import gsap from 'gsap'
import Fish from '~/components/GL/Fish.js'
import ColorBG from '~/components/GL/ColorBG.js'

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
        this.Fish = new Fish()
        this.Fish.init(this.els.slideSizer, this.els.parent)

        this.ColorBG = new ColorBG()
        this.ColorBG.init(this.els.parent)

        // State
        this.state = {
            activeSlide: 0,
            activeSlideIndex: 0,
            prevSlideIndex: -1,
            prevSlideType: 0,
            duration: 0,
            changingSlides: false,
            direction: 'down',
            dragging: false
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
                this.state.activeSlideIndex = this.getNextSlideI()
                
            } 
            // prev
            else {
                
                this.state.direction = 'up'
                this.state.activeSlideIndex = this.getPrevSlideI()
            }

            this.changeSlide(this.state.activeSlideIndex)

            this.state.prevSlideIndex = this.state.activeSlideIndex
        })

        document.addEventListener('mousedown', this.onDown.bind(this) )
        document.addEventListener('mousemove', this.onMove.bind(this) )
        document.addEventListener('mouseup', this.onUp.bind(this) )

        window.addEventListener('resize',() => { })
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
        this.els.sculptureTracking.indicator = this.els.parent.querySelector('.indicator span')

    }

    onDown(e) {
        if( this.state.changingSlides ) return

        this.state.dragging = true
        this.startMouseX = this.getPosition(e).x
        this.endMouseX = 0 // reset
    }

    onMove(e) {
        if( !this.state.dragging || this.state.changingSlides ) return
        
        APP.SceneBG.shouldRun = true;

        const currentX = this.getPosition(e).x
        this.endMouseX = currentX - this.startMouseX

        const color = this.endMouseX < 0 ? this.slides[this.getNextSlideI()].bg_color : this.slides[this.getPrevSlideI()].bg_color 
 
        this.ColorBG.previewColor(this.endMouseX,color)
    }   

    onUp() {
        if( !this.state.dragging || this.state.changingSlides ) return

        this.state.dragging = false

        if( this.endMouseX <= -70 ) {

            APP.SceneBG.shouldRun = false;
            this.state.direction = 'down'
            this.state.activeSlideIndex = this.getNextSlideI()
            this.changeSlide(this.state.activeSlideIndex, 'out')
            

        } else if( this.endMouseX >= 70 ) {

            APP.SceneBG.shouldRun = false;
            this.state.direction = 'up'
            this.state.activeSlideIndex = this.getPrevSlideI()
            this.changeSlide(this.state.activeSlideIndex, 'out')
            

        } else {
            this.ColorBG.previewColorReset()
        }
      

    }

    changeSlide(index, ease) {

        // DOM
        this.state.activeSlide = this.slides[index]

        this.updateSculptureText(index)
        this.updateSculptureLink()

        // GL
        this.Fish.switchTextures(index)
        this.ColorBG.changeColor(this.state.activeSlide.bg_color, ease)
        this.ColorBG.changeShader(this.state.direction)

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
            z: -1000,
            stagger: 0.025,
            duration: duration,
            ease: "power2.outIn"
        })

        //// In.
        tl.fromTo(typeIn.querySelectorAll('span'), {
            rotateX: this.state.direction == 'down' ? -90 : 90,
            y: this.state.direction == 'down' ? '20vh' : '-20vh',
            z: -1000
        },{
            opacity: 1,
            rotateX: 0,
            y: '0vh',
            z: 0,
            stagger: 0.025,
            duration: duration,
            ease: "power2.outIn"
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
        let duration = this.state.duration === 0 ? 0 : 0.6
        
        nameTL.pause()
        
        nameTL.fromTo(el,{
            y: '0%'
        }, {
            y: this.state.direction == 'down' ? '-100%' : '100%',
            ease: "power2.in",
            duration: duration
        })
        nameTL.call(callback)
        nameTL.fromTo(el,{
            y: this.state.direction == 'down' ? '100%' : '-100%'
        }, {
            y: '0%',
            ease: "power2.out",
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
 

     // loop ready wrap logic
     getNextSlideI() {
        return gsap.utils.wrap(0, this.slides.length, this.state.activeSlideIndex + 1)
     }
     getPrevSlideI() {
        return gsap.utils.wrap(0, this.slides.length, this.state.activeSlideIndex - 1)
     }

    // store all slide data is js obj
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

    // normalize touch and mouse
    getPosition({clientX, clientY, changedTouches, target}) {
        const x = changedTouches ? changedTouches[0].clientX : clientX
        const y = changedTouches ? changedTouches[0].clientY : clientY

        return {
            x, y, target,
        }
    }

}