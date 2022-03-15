export default function ({ route, redirect, $axios }) {

  const regex = new RegExp('af\/[a-zA-Z0-9]+');
  if (route.query.af) {
    $axios.post(`/api/affiliatereferral?af=${route.query.af}`)
      .then(res => { })
      .catch(err => {
        console.error('Error while reporting affiliate code. err: ', err)
      })
  } else if (regex.test(route.path)) {
    const affiliateCode = StringRoutes(route, "ONLYCODE");
    $axios.post('/api/affiliatereferral?af=' + affiliateCode)
      .then(res => { })
      .catch(err => {
        console.error('Error while reporting affiliate code. err: ', err)
      })
  }

  if (regex.test(route.path)) {
    redirect(`${StringRoutes(route, "")}`)
  }
}

// Split Routes
const StringRoutes = (route, codeId) => {
  const pathComponents = route.path.split('/')
  let urlCode = pathComponents[pathComponents.length - 1]

  let strUrlCode = `af/${urlCode}`;
  // ONLYCODE is for getting is code the af/*
  if (codeId === "ONLYCODE") {
    return pathComponents[pathComponents.length - 1]
  }

  return route.path.slice(0, -Number(checkIsNAN(strUrlCode.length)))
}

const checkIsNAN = (value) => {
  if (isNaN(value)) {
    return 0
  }

  return value
}