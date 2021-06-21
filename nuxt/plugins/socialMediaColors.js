export default (context, inject) => {
  const getSocialMediaColor = (name) => {
    switch(name) {
      case 'twitter':
        return '#1da1f2';
      case 'reddit':
        return '#ff4500';
      case 'telegram':
        return '#0088cc';
      case 'facebook':
        return '#1877f2';
      case 'instagram':
        return '#c32aa3';
      case 'linkedin':
        return '#0a66c2';
      default:
        return '#000000'
    }
  }
  inject('getSocialMediaColor', getSocialMediaColor);
  context.$getSocialMediaColor = getSocialMediaColor;
}
