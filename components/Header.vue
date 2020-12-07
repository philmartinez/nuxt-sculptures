
<template>
    <header>
        <div class="logo">
            <nuxt-link to="/">Minqh</nuxt-link>
        </div>
        <div class="contact">
            <a href="#">Get in Touch</a>
        </div>
    </header>
</template>


<script>
export default {
    
}
</script>

<style scoped lang="scss">
    header {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 1000;
        padding: 25px;
        display: flex;
        mix-blend-mode: difference;
        .logo a {
            text-decoration: none;
            color: #fff;
            font-weight: 500;
        }
        .contact {
            margin-left: auto;
        }
        .contact a {
            font-weight: 500;
            color: #fff;
            text-decoration: none;
            position: relative;
            display: block;
            &:before {
                display: block;
                position: absolute;
                left: 0;
                bottom: 0;
                width: 100%;
                height: 1px;
                background-color: #fff;
                content: '';
                z-index: -1;
                transform-origin: right;
                transform: scaleX(0);
                transition: transform 0.5s ease;
            }
            &:hover:before {
                transform: scaleX(1);
                transform-origin: left;
            }
        }
    }
</style>