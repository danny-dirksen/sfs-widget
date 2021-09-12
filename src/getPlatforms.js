let url = encodeURIComponent(window.location.href); // encodeURIComponent escapes more characters and is good for encoding query strings.
let title = encodeURI("Free Music and More from Songs for Saplings");
let header = encodeURI("Hey, thought you would enjoy this great kid's music that teaches the Bible!");
//let image = encodeURI("https://songsforsaplings.com/workspace/uploads/images/saplings-music-banner.jpg");
//let description = encodeURI("Free Music and More from Songs for Saplings");
let hashtag = encodeURI("Songs4Saplings");
let cc = encodeURI("music-widget@songsforsaplings.com");

let platforms;

function getPlatforms() {
  platforms = [
    {name: 'email', alt: 'Email', href: `mailto:?Subject=${title}&cc=${cc}&Body=${header}%0D%0A%0D%0A${url}`},
    {name: 'facebook', alt: 'Facebook', href: `http://www.facebook.com/sharer.php?u=${url}`},
    {name: 'instagram', alt: 'Instagram', href: `https://www.instagram.com/songs_for_saplings/`},
    {name: 'twitter', alt: 'Twitter', href: `https://twitter.com/share?url=${url}&text=${title}&hashtags=${hashtag}`},
    {name: 'message', alt: 'Message', href: `sms:?&body=${header}%0D%0A${url}`},
    {name: 'copy', alt: 'Copy', href: null}
    //{name: 'diggit', alt: 'Digg', href: `https://digg.com/news/submit-link`},
    //{name: 'google', alt: 'Goole+', href: `https://plus.google.com/share?url=${url}`},
    //{name: 'linkedin', alt: 'LinkedIn', href: `http://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`},
    //{name: 'pinterest', alt: 'Pinterest', href: `http://pinterest.com/pin/create/button/?url=${url}&media=${image}&description=${description}`},
    //{name: 'reddit', alt: 'Reddit', href: `http://reddit.com/submit?url=${url}&title=${title}`},
    //{name: 'stumbleupon', alt: 'StumbleUpon', href: `http://www.stumbleupon.com/submit?url=${url}&title=${title}`},
    //{name: 'tumblr', alt: 'Tumblr', href: `http://www.tumblr.com/share/link?url=${url}&title=${title}`},
    //{name: 'vk', alt: 'VK', href: `http://vkontakte.ru/share.php?url=${url}`},
    //{name: 'yummly', alt: 'Yummly', href: `http://www.yummly.com/urb/verify?url=${url}&title=${title}`}
  ]
  platforms.forEach(platform => {
    platform.logo = require('./resources/share-logos/' + platform.name + '.png')
  });
  return platforms;
}

getPlatforms();



export default getPlatforms
