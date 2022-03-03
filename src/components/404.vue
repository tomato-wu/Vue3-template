<template>
    <a-result status="404" :title="title" :sub-title="subTitle" class="text-center">
    <template #extra>
      <a-button type="primary" @click="handleBack">Back Home</a-button>
    </template>
  </a-result>
</template>
<script setup="props" lang="ts">
import { Result as AResult, Button as AButton } from 'ant-design-vue'
import { useBack } from '../utils/usePage'
import { defineProps } from 'vue'

defineProps({
  title: {
    type: String,
    default: '404'
  },
  subTitle: {
    type: String,
    default: 'Sorry, the page you visited does not exist.'
  }
})

const handleBack = () => {
  useBack()
}
</script>
