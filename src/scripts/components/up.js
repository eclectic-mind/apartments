const upLink = document.querySelector('.up-link');
const topLink = document.querySelector('.start');

upLink .addEventListener('click', (evt) => {
  evt.preventDefault();
  
  const scrollTarget = topLink;
  const topOffset = topLink.offsetHeight;
  const elementPosition = scrollTarget.getBoundingClientRect().top;
  const offsetPosition = elementPosition - topOffset;

  window.scrollBy({
    top: offsetPosition,
    behavior: 'smooth'
  });
});

window.addEventListener('scroll', () => {
  if (pageYOffset < document.documentElement.clientHeight) {
    if (upLink.classList.contains('invisible')) {
      upLink.classList.remove('invisible');
    }
  }
});