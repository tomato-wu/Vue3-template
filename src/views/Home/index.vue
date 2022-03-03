<template>
    <div class="text-xl" v-monitor>
        <div v-for="(item, idx) in 10000" :key="idx">
            <a-button size="large">{{item}}</a-button>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, nextTick } from 'vue'
import { Monitor } from '../../utils/monitor'
import { Button } from 'ant-design-vue'

const monitor = Monitor.getInstance()
export default defineComponent({
  components: {
    AButton: Button
  },
  directives: {
    monitor: {
      beforeMount () {
        monitor.start('hello')
      },
      mounted (el) {
        nextTick(() => {
          monitor.stop('hello')
        })
        console.log(el?.style)
      }
    }
  }
})
</script>
