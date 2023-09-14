# Image Search and Viewer App
Welcome to the Image Search and Viewer App repository! This project is a simple application for searching and viewing images based on keywords. It uses the Pixabay API as the backend to fetch images and implements pagination with infinite scrolling using the IntersectionObserver API. Image viewing is achieved through the SimpleLightbox library.

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup](#setup)
- [Usage](#usage)
- [Contributing](#contributing)

## Introduction
The Image Search and Viewer App allows users to search for images by entering keywords. It leverages the Pixabay API to retrieve images and provides a seamless browsing experience with infinite scrolling. Users can click on images to view them in a lightbox.

## Features
- **Image Search**: Enter keywords to search for images.
- **Pagination**: Images are fetched in batches, and new batches are loaded when the user reaches the end of the list (infinite scrolling).
- **Lightbox Viewer**: Click on an image to view it in a lightbox with options for navigation.

## Technologies Used
- HTML
- CSS
- JavaScript
- [Pixabay API](https://pixabay.com/api/docs/)
- [SimpleLightbox](https://simplelightbox.com/)
- IntersectionObserver API

## Setup
To set up the project locally, follow these steps:
1. Clone the repository: `git clone https://github.com/333Nikita333/Image-Gallery.git`
2. Navigate to the project directory: `cd Image-Gallery`
3. Open the `index.html` file in your preferred web browser.

## Usage
1. Open the application in your web browser.
2. Enter keywords in the search bar and press Enter to retrieve images.
3. Scroll down to view more images, and new images will be loaded automatically as you reach the end of the list.
4. Click on an image to view it in a lightbox. You can navigate between images using the lightbox controls.

## Contributing
If you'd like to contribute to this project, please follow these guidelines:
1. Fork the repository.
2. Create a new branch for your feature or bug fix: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Create a pull request.
We welcome contributions from the community and appreciate your help in making this project even better!
