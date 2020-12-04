<template>

<div id="loading-animation">
    <div class="inner">
        <h3>
        <span>I</span> 
        <span>wish</span> 
        <span>I</span> 
        <span>wish</span> 
        <span>I</span> 
        <span>was</span> 
        <span>a</span> 
        <span>fish</span></h3>
    </div>
</div>

</template>

<script>

    import { gsap, Back } from 'gsap';
    import { mapState, mapMutations } from 'vuex'

    export default {
        methods: {
            removeSplash() {
                
                this.tl.to('#loading-animation .inner',{
                    x: '-100%',
                    ease: "Power4.easeInOut",
                    duration: 1.8
                });
                this.tl.to('#loading-animation',{
                    x: '100%',
                    ease: "Power4.easeInOut",
                    duration: 1.8,
                    onComplete: function() {
                         APP.Slideshow.slides.map(slide => slide.Fish).forEach((fish, i) => {
                            fish.showFishWithDisplacement()
                            APP.Scene.stopRender(1500)
                        })
                    }
                }, "-=1.8");

                setTimeout(this.showFish,1850);
                
            },
            showFish() {
                APP.Slideshow.slides.map(slide => slide.Fish).forEach((fish, i) => {
                    fish.showFishWithDisplacement()
                    APP.Scene.stopRender(1500)
                })
            }
        },
        mounted() {

            this.tl = gsap.timeline();
            this.tl.to("#loading-animation h3 span", {
                opacity: 1, 
                y: 0, 
                duration: 0.6, 
                delay: 0.15,
                stagger: 0.06,
                ease: Back.easeOut.config(5)
            });

        },
         computed: mapState(['page','items','loaded']),
         watch: {
            loaded(bool) {
                if( true == bool ) {
                    this.removeSplash()
                }
                
            }
         },
    }
</script>

<style lang="scss">

#loading-animation {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 100;
    color: #fff;
    background-color: #111;
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    .inner {
        padding: 30px;
        width: 100%;
        text-align: center;
    }
    h3 span {
        display: inline-block;
        opacity: 0;
        transform: translateY(25px)
    }
    h3 {
        font-size: 26px;
    }
}
#loading-animation.loaded {
    pointer-events: none;
}

</style>