<template>
  <div>
    <mobile-bind v-if="bind_status == 0" />
    <clear-mobile-bind v-if="bind_status == 1" />
  </div>
</template>

<script>

import MobileBind from './components/MobileBind'
import ClearMobileBind from './components/ClearMobileBind'

export default {
  name: 'UserAuth',
  components: { MobileBind, ClearMobileBind },
  data() {
    return {
    }
  },
  // 认证状态
  computed: {
    bind_status() {
      return this.$store.state.user.info.mobilebind
    }
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>
