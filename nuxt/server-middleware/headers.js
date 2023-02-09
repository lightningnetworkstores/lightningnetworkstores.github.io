export default function(req, res, next) {
  const pages = {
    home: /^\/$|\/tag\/.*$/g, // no path or /tag/*
    discuss: /\/discuss\/{0,1}$/g
  }
  if(req.url.match(pages.home)) {
    res.setHeader('Cache-Tag', 'homepage')
    res.setHeader('Cache-Control', 'max-age=2')
  }
  if (req.url.match(pages.discuss)) {
    res.setHeader('Cache-Tag', 'discuss')
    res.setHeader('Cache-Control', 'max-age=2')
  }
  next()
}