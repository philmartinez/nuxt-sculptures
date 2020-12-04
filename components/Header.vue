
<template>
    <header>
        <div class="logo">
            <nuxt-link to="/">Not Minq</nuxt-link>
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
            font-weight: 700;
        }
        .contact {
            margin-left: auto;
        }
        .contact a {
            font-weight: 700;
            color: #fff;
            padding: 10px 20px;
            text-decoration: none;
            position: relative;
            display: block;
            &:before {
                display: block;
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                content: '';
                border: 1px solid rgba(0,0,0,0.1);
                z-index: -1;
                transition: transform 0.5s ease;
            }
            &:hover:before {
                transform: scale(1.05, 1.1);
            }
        }
    }
</style>