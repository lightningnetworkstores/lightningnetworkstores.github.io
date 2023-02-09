export default function(req, res, next) {
  const pages = {
    home: /\/$|\/tag.*$/g,
    discuss: /discuss/g
  }
  if(req.url.match(pages.home)) {
    res.setHeader('Cache-Tag', 'home')
  }
  if (req.url.match(pages.discuss)) {
    res.setHeader('Cache-Tag', 'discuss')
  }
  next()
}