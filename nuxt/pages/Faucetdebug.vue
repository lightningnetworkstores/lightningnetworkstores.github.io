<template>
  <div>Debug: {{ debug }} fingerprint: {{ deviceUUID }}</div>
</template>

<script>
export default {
  data() {
    return {
      deviceUUID: '',
      du: {},
    }
  },
  computed: {
    debug() {
      return JSON.stringify(this.dua, null, 2)
    },
    dua() {
      return {
        platform: this.du?.platform,
        os: this.du.os,
        cpuCores: this.du.cpuCores,
        isAuthoritative: this.du.isAuthoritative,
        silkAccelerated: this.du.silkAccelerated,
        isKindleFire: this.du.isKindleFire,
        isDesktop: this.du.isDesktop,
        isMobile: this.du.isMobile,
        isTablet: this.du.isTablet,
        isWindows: this.du.isWindows,
        isLinux: this.du.isLinux,
        isLinux64: this.du.isLinux64,
        isMac: this.du.isMac,
        isiPad: this.du.isiPad,
        isiPhone: this.du.isiPhone,
        isiPod: this.du.isiPod,
        isSmartTV: this.du.isSmartTV,
        pixelDepth: this.du.pixelDepth,
        isTouchScreen: this.du.isTouchScreen,
      }
    },
  },
  async mounted() {
    const { getDeviceUUID, du } = await import('@/utils/deviceUUID')
    this.du = du
    this.deviceUUID = getDeviceUUID()
  },
}
</script>

<style lang="scss" scoped></style>
