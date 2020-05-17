
import gsap from 'gsap'

gsap.defaults({
    ease: "power2.inOut", 
    duration: 1.4
});

export default class Slideshow {

    constructor(scene, items) {

        this.scene = scene

        this.items = items

        this.els = {
            parent: document.querySelector('.sculpture-slideshow'),
            slides: document.querySelectorAll('.sculpture-slideshow .sculpture'),
            slideType: document.querySelector('.sculpture-slideshow .sculpture-type'),
            sculptureMetaLinks: Array.from(document.querySelectorAll('.sculpture-slideshow .sculpture-meta .link a')),
            sculptureMetaNamesInner: document.querySelector('.sculpture-slideshow .sculpture-meta .name-wrap .inner'),
            sculptureBGtext: {},
            sculptureTracking: {}
        }

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

        this.slides = this.getSlides()

        this.createMarkup()

        this.modelNameHeight   = this.getElHeight('.sculpture-meta .text .inner .name')
        this.trackingNumHeight = this.getElHeight('.sculpture-meta .progress .inner span')

        this.changeSlide(0)
        this.state.duration = 1.4
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
        <span class="whale">
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
                <span class="inner"></span>
            </span>
            <span class="indicator"><span></span></span>
            <span class="total">${this.slides.length}</span>`

        // Duplicate for wrap loops.
        let duplicateName = this.els.sculptureMetaNamesInner.querySelector('span:last-child').cloneNode(true)
        this.els.sculptureMetaNamesInner.prepend(duplicateName)
        

        // Cache els.
        this.els.sculptureBGtext.whale   = this.els.sculptureType.querySelector('.whale')
        this.els.sculptureBGtext.grouper = this.els.sculptureType.querySelector('.grouper')
        this.els.sculptureBGtext.snapper = this.els.sculptureType.querySelector('.snapper')


        // Append els.
        this.els.parent.appendChild(this.els.sculptureType)
        this.els.parent.querySelector('.sculpture-meta').prepend(totalMarkup)
 
        this.slides.forEach( (el, index) => { 

            if( index === 0) {
                let wrappingNum = document.createElement('span')
                wrappingNum.innerHTML = this.slides.length
                this.els.parent.querySelector('.current .inner').appendChild(wrappingNum) 
            }

            let number = document.createElement('span')
            number.innerHTML = index + 1
            this.els.parent.querySelector('.current .inner').appendChild(number) 
        })

        this.els.sculptureTracking.numberInner = this.els.parent.querySelector('.current .inner')
        this.els.sculptureTracking.indicator   = this.els.parent.querySelector('.indicator span')

    }


    changeSlide(index) {

        this.state.activeSlide = this.slides[index]

        this.updateSculptureColors()
        this.updateSculptureText()
        this.updateSculptureLink()
        
        this.state.changingSlides = true
        setTimeout( () => { this.state.changingSlides = false }, 1400 )
    }

    
    updateSculptureText() {

        let tl = gsap.timeline()
        let duration = this.state.duration === 0 ? 0 : '0.68'


        if( this.state.prevSlideType !== this.state.activeSlide.type ) {

            // BG Text.
            //// Out.
            if( this.state.prevSlideType !== 0 ) {

                let typeOut = this.els.sculptureBGtext[this.state.prevSlideType]

                tl.fromTo(typeOut.querySelectorAll('span'), {
                    opacity: 1,
                    rotateY: 0,
                    //y: '0vh'
                },{
                    opacity: 0,
                    rotateY: -25,
                    //y: '-20vh',
                    stagger: 0.03,
                    duration: duration,
                    ease: "power1.in"
                })

            }

            //// In.
            let typeIn = this.els.sculptureBGtext[this.state.activeSlide.type]
            
            tl.fromTo(typeIn.querySelectorAll('span'), {
                opacity: 0,
                rotateY: 25,
               // y: '20vh'
            },{
                opacity: 1,
                rotateY: 0,
                //y: '0vh',
                stagger: 0.03,
                duration: duration,
                ease: "power2.out"
            },'-=0')


            // Bottom Meta Name
            this.updateVerticalOverflowSelection(this.modelNameHeight, this.els.sculptureMetaNamesInner)

            // Tracking Number
            this.updateVerticalOverflowSelection(this.trackingNumHeight, this.els.sculptureTracking.numberInner)

        }

         // Store previous type
         this.state.prevSlideType = this.state.activeSlide.type
        

     }


     updateVerticalOverflowSelection(elHeight, elContainerInner) {

        let deltaY = ( this.state.direction == 'down' ) ? "-=" : "+="; //up or down
     
        let wrapAmount = (elHeight * this.slides.length) * -1 
        let containerWrap = gsap.utils.wrap(0, wrapAmount)

        let duration = this.state.duration === 0 ? 0 : '1.4'

        gsap.to(elContainerInner, {
            y: deltaY + elHeight,
            duration: duration,
            modifiers: {
                y: function(y) {
                    return containerWrap(parseFloat(y)) + 'px'
                }
            }
        })

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
         gsap.to(this.els.sculptureType, {
             color: font_color,
             duration: this.state.duration
         })
     }

     getElHeight(elSelector) {

         let name = this.els.parent.querySelector(elSelector)
         let nameStyle = window.getComputedStyle(name)

        return name.clientHeight + parseInt(nameStyle.marginBottom)
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