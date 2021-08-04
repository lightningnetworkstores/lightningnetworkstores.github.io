import devUUID from '@/plugins/deviceUUID'

const DeviceUUID = devUUID.DeviceUUID

const du = new DeviceUUID().parse()

const dua = [
  du.language,
  du.platform,
  du.os,
  du.cpuCores,
  du.isAuthoritative,
  du.silkAccelerated,
  du.isKindleFire,
  du.isDesktop,
  du.isMobile,
  du.isTablet,
  du.isWindows,
  du.isLinux,
  du.isLinux64,
  du.isMac,
  du.isiPad,
  du.isiPhone,
  du.isiPod,
  du.isSmartTV,
  du.pixelDepth,
  du.isTouchScreen,
]

export function getDeviceUUID() {
  console.log({ dua })
  return du.hashMD5(dua.join(':'))
}
