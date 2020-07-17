
<template>
    <header>
        <div class="logo">
            <nuxt-link to="/">Not Minq</nuxt-link>
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
        padding: 15px;
        display: flex;
        .logo a {
            text-decoration: none;
            color: #000;
            font-weight: 700;
        }
    }
</style>