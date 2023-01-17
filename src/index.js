import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import getRefs from './js/get-refs';
import PhotoApiService from './js/photo-service';

const refs = getRefs();
const optionsObserver = {
  root: null,
  rootMargin: '300px',
  threshold: 0,
};
let observer = new IntersectionObserver(onLoad, optionsObserver);
const photoApiService = new PhotoApiService();

refs.searchForm.addEventListener('submit', onSearch);

async function onSearch(e) {
  e.preventDefault();

  try {
    photoApiService.searchQuery =
      e.currentTarget.elements.searchQuery.value.trim();
    photoApiService.resetPage();
    clearGalleryMarkup();

    if (photoApiService.searchQuery === '') {
      Notiflix.Notify.warning('Please enter your request');
      return;
    }

    const request = await photoApiService.processRequest();
    const {
      data: { hits, totalHits },
    } = request;

    observer.observe(refs.guard);
    renderCardsOfPhotos(hits);
    informsTotalHits(totalHits);
  } catch (error) {
    console.log(error.message);
  }
}

//* Creates photo gallery markup
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
  createsSimplelightbox();
  onScroll();
}

//* Infinite scroll
async function onLoad(entries, observer) {
  try {
    entries.forEach(async entry => {
      if (entry.isIntersecting) {
        const request = await photoApiService.processRequest();
        const {
          data: { hits, totalHits },
        } = request;
        const currentPage = photoApiService.page;
        const totalPage = Math.ceil(totalHits / photoApiService.perPage);
        
        renderCardsOfPhotos(hits);

        if (totalHits === 0) {
          Notiflix.Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          );
          return;
        }

        if (totalPage < currentPage) {
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

//* Smooth scrolling
function onScroll() {
  const { height: cardHeight } =
    refs.gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 0,
    behavior: 'smooth',
  });
}

//* Gallery cleaning
function clearGalleryMarkup() {
  refs.gallery.innerHTML = '';
}

//* Informing about the number of found photos
function informsTotalHits(hits) {
  if (hits === 0) {
    return;
  }
  Notiflix.Notify.success(`Hooray! We found ${hits} images.`);
}

//* Creation Simplelightbox
function createsSimplelightbox() {
  const options = {
    captionsData: 'alt',
    captionDelay: 250,
  };
  const lightbox = new SimpleLightbox('.gallery a', options);
  lightbox.refresh();
}
