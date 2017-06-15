const zenscroll = require('zenscroll');

var edgeOffset = 0; // px
zenscroll.setup(800, edgeOffset);

export const blockHandler = function (e: Event) {
  console.log('block');
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
};

const removeBlockHandler = () => {
  console.log('remove block handler');
  window.removeEventListener('scroll', blockHandler);
  window.removeEventListener('wheel', blockHandler);
};
let isScrolling = false;

export function scroll(el: Element, done: ((e?: Error) => void)) {

  if (isScrolling) {
    console.warn('is already scrolling - reject');
    done(new Error('already scrolling'));
    return;
  } else {
    isScrolling = true;
    window.addEventListener('scroll', blockHandler, true);
    window.addEventListener('wheel', blockHandler, true);
    zenscroll.to(el, 800, () => {
      removeBlockHandler();
      isScrolling = false;
      done();
    });
  }
}