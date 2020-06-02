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
            easing: 'inOut',
            changingSlides: false,
            previewColorTracked: false,
            previewColorDir: 'down',
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
        this.state.duration = 1.2
    }

    events() {

        document.addEventListener('wheel', (e) => {

            if( this.state.changingSlides ) return
           
            // next
            if( e.deltaY > 5 ) {
                this.state.direction = 'down'
                this.state.activeSlideIndex = this.getNextSlideI()
                
            } 
            // prev
            else if( e.deltaY < -5 ) {
                this.state.direction = 'up'
                this.state.activeSlideIndex = this.getPrevSlideI()
            }

            if( e.deltaY > 5 || e.deltaY < -5) {
                this.state.easing = 'inOut'
                this.changeSlide(this.state.activeSlideIndex)

                this.state.prevSlideIndex = this.state.activeSlideIndex
            }
            
        })

        document.addEventListener('mousedown', this.onDown.bind(this) )
        document.addEventListener('mousemove', this.onMove.bind(this) )
        document.addEventListener('mouseup', this.onUp.bind(this) )
        
        this.els.parent.querySelector('.link').addEventListener('mouseup', this.viewDetailOpen.bind(this) )
        
        this.els.parent.querySelector('.link').addEventListener('mouseover', this.viewDetailOver.bind(this) )
        this.els.parent.querySelector('.link').addEventListener('mouseleave', this.viewDetailLeave.bind(this) )

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
        this.els.sculptureTotal = document.createElement('div')
        this.els.sculptureTotal.classList.add('progress')
        this.els.sculptureTotal.innerHTML = `
            <span class="number">No.</span>
            <span class="current">
                <span class="inner">1</span>
            </span>
            <span class="indicator"><span></span></span>
            <span class="total">${this.slides.length}</span>`

        // Cache els.
        this.els.sculptureBGtext.bowhead = this.els.sculptureType.querySelector('.bowhead')
        this.els.sculptureBGtext.grouper = this.els.sculptureType.querySelector('.grouper')
        this.els.sculptureBGtext.snapper = this.els.sculptureType.querySelector('.snapper')
        this.els.sculptureViewDetail = this.els.parent.querySelector('.view-detail')

        // Append els.
        this.els.parent.appendChild(this.els.sculptureType)
        this.els.parent.querySelector('.sculpture-meta').prepend(this.els.sculptureTotal)
        this.els.sculptureTracking.number = this.els.parent.querySelector('.current .inner')
        this.els.sculptureTracking.indicator = this.els.parent.querySelector('.indicator span')

    }

    viewDetailOver() {
        if( this.state.changingSlides ) return
        this.Fish.previewFlopInit()
    }

    viewDetailLeave() {
       
    }

    viewDetailOpen() {
        this.singleSculptureEnter()
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

        
        let color;

        if( !this.state.previewColorTracked && (this.endMouseX > 15 || this.endMouseX < -15) ) {
            
            this.ColorBG.material.uniforms.uProg.value = 0

            if( this.endMouseX < 0 ) {
                color = this.slides[this.getNextSlideI()].bg_color 
                this.state.previewColorDir = 'down'
            } else {
                color = this.slides[this.getPrevSlideI()].bg_color 
                this.state.previewColorDir = 'up'
            }
            
            this.state.previewColorTracked = true

            this.ColorBG.preview = true
            this.ColorBG.previewColorInit(this.state.previewColorDir,color)
            this.ColorBG.previewColor = color

        }
        
        this.ColorBG.previewX = this.state.previewColorDir === 'down' ? gsap.utils.clamp(-3000, 0, this.endMouseX) : gsap.utils.clamp(0, 3000, this.endMouseX)
        //this.Fish.previewX = this.state.previewColorDir === 'down' ? gsap.utils.clamp(-3000, 0, this.endMouseX) : gsap.utils.clamp(0, 3000, this.endMouseX)
     
    }   

    onUp() {
        if( !this.state.dragging || this.state.changingSlides ) return

        this.state.dragging = false
        this.state.previewColorTracked = false

        if( this.endMouseX <= -90 ) {
            this.state.direction = 'down'
            this.state.activeSlideIndex = this.getNextSlideI()
        } else if( this.endMouseX >= 90 ) {
            this.state.direction = 'up'
            this.state.activeSlideIndex = this.getPrevSlideI()
        }

        if( this.endMouseX <= -90 || this.endMouseX >= 90) {
            APP.SceneBG.shouldRun = false;
            this.state.easing = 'out'
            this.changeSlide(this.state.activeSlideIndex, 'out')
            return
        }
        
        this.ColorBG.previewColorReset()
        

    }

    changeSlide(index, ease) {

        // DOM
        this.state.activeSlide = this.slides[index]

        this.updateSculptureText(index)
        this.updateSculptureLink()

        // GL
        this.Fish.switchTextures(index, ease)
        this.ColorBG.changeColor(this.state.activeSlide.bg_color, ease)
        this.ColorBG.changeShader(this.state.direction)
        this.ColorBG.preview = false

        // State
        this.state.changingSlides = true
        setTimeout( () => { this.state.changingSlides = false }, this.state.duration*1000 )
    
    }

    
    updateSculptureText(index) {

        let tl = gsap.timeline()

        // BG Text.
        let typeOut = this.els.sculptureBGtext[this.state.prevSlideType]
        let typeIn = this.els.sculptureBGtext[this.state.activeSlide.type]
        
        //// In.
        tl.fromTo(typeIn.querySelectorAll('span'), {
            rotateX: this.state.direction == 'down' ? -90 : 90,
            y: this.state.direction == 'down' ? '25vh' : '-25vh',
            z: -500,
            opacity: 0
        },{
            opacity: 1,
            rotateX: 0,
            y: '0vh',
            z: 0,
            stagger: 0.04,
            duration: 0.94,
            ease: `power2.${this.state.easing}`
        })

         //// Out.
         tl.fromTo(typeOut.querySelectorAll('span'), {
            opacity: 1,
            rotateX: 0,
            z: 0,
            y: '0vh'
        },{
            rotateX: this.state.direction == 'down' ? 90 : -90,
            y: this.state.direction == 'down' ? '-25vh' : '25vh',
            z: -500,
            opacity: 0,
            stagger: 0.04,
            duration: 0.94,
            ease: `power2.${this.state.easing}`
        },'-=1.18')
       


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
        
        nameTL.pause()
        
        nameTL.fromTo(el,{
            y: '0%'
        }, {
            y: this.state.direction == 'down' ? '-100%' : '100%',
            ease: this.state.easing === 'out' ? "power2.out" : "power2.in",
            duration: this.state.easing === 'out' ? 0.47 : this.state.duration/2
        })
        nameTL.call(callback)
        nameTL.fromTo(el,{
            y: this.state.direction == 'down' ? '100%' : '-100%'
        }, {
            y: '0%',
            ease: "power2.out",
            duration: this.state.easing === 'out' ? 0.47 : this.state.duration/2
        })
      
        nameTL.play()
     }


     singleSculptureEnter() {

        this.state.changingSlides = true
   
        gsap.to([this.els.sculptureTotal, this.els.sculptureViewDetail], {
            opacity: 0,
            stagger: 0.15,
            y: '20px',
            duration: 0.8,
            ease: "power2.inOut"
        })
        
     }

     singleSculptureExit() {
        this.state.changingSlides = false
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