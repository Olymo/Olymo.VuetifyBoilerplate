<template>
    
</template>

<script>
import EventBus from '../event-bus.js'

export default {
    beforeMount() {
        localStorage.removeItem("tokens");
        EventBus.$emit('logout', 'User logged out')
        this.$router.push('/');
    }
}
</script>

