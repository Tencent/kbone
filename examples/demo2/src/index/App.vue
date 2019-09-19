<template>
  <div class="cnt">
    <Header check-reduce></Header>
    <p>1111<span class="red">111111</span>1111</p>
    <p check-reduce>2222<span class="red">222222</span>2222</p>
    <p>3333<span class="red">333333</span>3333</p>
    <p>4444<span class="red" check-reduce>444444</span>4444</p>
    <p check-reduce>5555<span class="red">555555</span>5555</p>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from '../common/Header.vue'
import Footer from 'reduce-loader!../common/Footer.vue'
import 'reduce-loader!./web'
import {printf1} from './printf'

printf1()

export default {
  name: 'App',
  components: {
    Header,
    Footer
  },
  mounted() {
    if (process.env.isMiniprogram) {
      console.log('in miniprogram')
    } else {
      console.log('in web')
    }
  },
}
</script>

<style>
.cnt {
  margin-top: 20px;
}
p {
  margin-bottom: 20px;
  border: 1px solid #aaa;
  border-radius: 5px;
  padding: 5px;
}
.red {
  color: red;
}
</style>
