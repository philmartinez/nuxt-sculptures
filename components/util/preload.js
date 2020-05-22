import * as imagesLoaded from 'imagesloaded'

export default function preloadImages(selector) {
    return new Promise((resolve, reject) => {
        imagesLoaded(document.querySelectorAll(selector), {background: true}, resolve);
    })
}