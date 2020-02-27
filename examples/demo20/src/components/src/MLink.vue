<template>
  <a :href="url" :target="target"><slot/></a>
</template>

<script>
import { reactive, toRefs, computed } from 'vue'

export default {
  name: 'MLink',
  props: {
    href: String,
    target: String
  },
  setup (props) {
    const state = reactive({
      target: props.target
    })
    state.url = computed(() => {
      if (!props.href) {
        return 'javascript:void(0)'
      }
      if (process.env.isMiniprogram) {
        return props.href
      } else {
        return `${props.href}.html`
      }
    })
    return {
      ...toRefs(state)
    }
  }
}
</script>

<style></style>
