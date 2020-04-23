<template>
  <div>
    <button @click="onClickSetLocalStorage">设置 localStorage</button>
    <button @click="onClickSetSessionStorage">设置 sessionStorage</button>
  </div>
</template>

<script>
export default {
    props: ['name'],
    mounted() {
        window.addEventListener('storage', evt => {
            console.log(`page${this.name} receive storage event`)
            console.log(`oldValue: ${evt.oldValue} -- newValue: ${evt.newValue}`)
            console.log(`target: ${evt.target === window} -- url: ${evt.url}`)
        })
    },
    methods: {
        onClickSetLocalStorage() {
            localStorage.setItem('timeStamp', +new Date())
        },

        onClickSetSessionStorage() {
            sessionStorage.setItem('timeStamp', +new Date())
        },
    },
}
</script>

<style></style>
