import Vue from 'vue'

Vue.filter('splitNumber', function (value) {
  try {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  } catch (error) {
    return value
  }
})
