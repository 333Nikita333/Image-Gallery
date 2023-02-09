import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import getRefs from './js/get-refs';
import PhotoApiService from './js/photo-service';

const refs = getRefs();
const optionsObserver = {
  root: null,
  rootMargin: '200px',
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
    clearGalleryMarkup();
    photoApiService.resetPage();

    if (photoApiService.searchQuery === '') {
      return Notiflix.Notify.warning('Please enter your request');
    }

    const request = await photoApiService.processRequest();
    const {
      data: { hits, totalHits },
    } = request;

    if (totalHits === 0) {
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    renderCardsOfPhotos(hits);
    informsTotalHits(totalHits);
  } catch (error) {
    console.log(error.message);
  }
}

//* Creates photo gallery markup
function renderCardsOfPhotos(arr) {
  if (arr.length === 0 || photoApiService.searchQuery === '') {
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

  observer.observe(refs.gallery.lastElementChild);
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
        onScroll();

        if (totalPage < currentPage && refs.gallery.children.length > 0) {
          Notiflix.Notify.failure(
            "We're sorry, but you've reached the end of search results."
          );
          observer.unobserve(refs.gallery.lastElementChild);
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
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

//* Gallery cleaning
function clearGalleryMarkup() {
  refs.gallery.innerHTML = '';
}

//* Informing about the number of found photos
function informsTotalHits(hits) {
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
