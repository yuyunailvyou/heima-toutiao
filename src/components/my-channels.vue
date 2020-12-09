<template>
  <div class="my-channels"> <el-select  @change="handleSelectChange" :value="value" placeholder="请选择频道" >
      <el-option
      v-for="item in channels"
      :key="item.id"
      :label="item.name"
      :value="item.id">
    </el-option>
    </el-select></div>
</template>

<script>
import { reqGetChannel } from '@/api/articles.js'
export default {
  name: 'MyChannels',
  props: ['value'],
  data () {
    return {
      channels: []
    }
  },
  async created () {
    const res = await reqGetChannel()
    this.channels = res.data.data.channels
  },
  methods: {
    handleSelectChange (value) {
      this.$emit('input', value)
    }
  }
}
</script>

<style>

</style>
