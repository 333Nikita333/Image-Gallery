import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import getRefs from './js/get-refs';
import PhotoApiService from './js/photo-service';

const refs = getRefs();
const options = {
  root: null,
  rootMargin: '300px',
  threshold: 0,
};
let observer = new IntersectionObserver(onLoad, options);
const photoApiService = new PhotoApiService();
refs.searchForm.addEventListener('submit', onSearch);

async function onSearch(e) {
  e.preventDefault();

  photoApiService.searchQuery = e.currentTarget.elements.searchQuery.value;
  try {
    photoApiService.resetPage();
    clearGalleryMarkup();

    if (photoApiService.searchQuery === '') {
      Notiflix.Notify.warning('Please enter your request');
      return;
    }

    const response = await photoApiService.processRequest();
    const {
      data: { hits, totalHits },
    } = response;

    if (hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    
    renderCardsOfPhotos(hits);
    informsTotalHits(totalHits);
  } catch (error) {
    console.log(error.message);
  }
}
function clearGalleryMarkup() {
  refs.gallery.innerHTML = '';
}
function informsTotalHits(hits) {
  if (hits === 0) {
    return;
  }
  Notiflix.Notify.success(`Hooray! We found ${hits} images.`);
}
async function onLoad(entries, observer) {
  try {
    entries.forEach(async entry => {
      if (entry.isIntersecting) {
        const request = await photoApiService.processRequest();
        renderCardsOfPhotos(request.data.hits);

        if (request.data.totalHits <= refs.gallery.children.length) {
          Notiflix.Notify.failure(
            "We're sorry, but you've reached the end of search results."
          );
          observer.unobserve(refs.guard);
        }
      }
    });
  } catch (error) {
    console.log(error.message);
  }
}
function onScroll() {
  if (!refs.gallery.firstElementChild) {
    return;
  }

  const { height: cardHeight } =
    refs.gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
function createsSimplelightbox() {
  const options = {
    captionsData: 'alt',
    captionDelay: 250,
    download: true,
  };
  const lightbox = new SimpleLightbox('.gallery a', options);
  lightbox.refresh();
}
function renderCardsOfPhotos(arr) {
  if (arr.length === 0) {
    return;
  }
  const markup = arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
      <a class="js-link-photo" href="${largeImageURL}">
          <img
            src="${webformatURL}"
            alt="${tags}"
          loading="lazy"
        />
        <div class="info">
          <p class="info-item">
            <b>Likes</b>
            ${likes}
          </p>
          <p class="info-item">
            <b>Views</b>
            ${views}
          </p>
          <p class="info-item">
            <b>Comments</b>
            ${comments}
          </p>
          <p class="info-item">
            <b>Downloads</b>
            ${downloads}
          </p>
        </div>
        </a>
      </div>`
    )
    .join('');

  refs.gallery.insertAdjacentHTML('beforeend', markup);
  observer.observe(refs.guard);
  createsSimplelightbox();
  onScroll();

  if (refs.gallery.classList.contains('js-gallery')) {
    return;
  }
  refs.gallery.classList.add('js-gallery');
}
