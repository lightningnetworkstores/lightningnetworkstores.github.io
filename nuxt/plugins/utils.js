export default (context, inject) => {
    const createEmbedLink = (link) => {
        if (link.includes('youtube.com/embed')) return link;
        if(link.includes('youtu.be')) {
            let urlComponents = link.split('/')
            return 'https://youtube.com/embed/' + urlComponents[urlComponents.length-1]
        }
        let queryString = link.split('?')[1]
        let urlParams = new URLSearchParams(queryString);
        return 'https://youtube.com/embed/' + urlParams.get('v');
    }
    inject('createEmbedLink', createEmbedLink);
    context.$createEmbedLink = createEmbedLink;
  }