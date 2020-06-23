<template>

<div class="single-sculpture">
    
</div>

</template>

<script>

import { mapState } from 'vuex'

export default {
    data() {
        return {
            fishSet: false,
            sculpture: this.$route.params.sculpture
        }
    },
    computed: {
        ...mapState(['items','loaded', 'page']),
        fish() {
            return this.items.find( item => item.name.toLowerCase() === this.sculpture )
        }
    },
    methods: {
        changeFish() {
            const index = this.fish.id-1

            APP.Slideshow.changeSlide(index)
            APP.Slideshow.state.instant = true
            APP.Scene.shouldRun = true
            APP.Slideshow.slideTo(APP.Slideshow.slides[index])
        }
    },
    watch: {
        loaded: function(loaded) {
            // If user accesses single fish view directly
            if( loaded === true && this.fishSet === false) {
                this.changeFish()
            }
        }
    },
    mounted() {
        // back/forward history 
        if(this.loaded === true) {
            this.changeFish()
            this.fishSet = true
        }
    
    }
}
</script>

<style scoped lang="scss">

</style>
