import {cache} from 'react';
import {getAllImageIds, getImageByIdFromDb} from './db';
import type {GalleryItem} from './types';
import 'server-only';
let imageLinks = new Array<GalleryItem>(10000);

const THUMBNAIL_WIDTH = 1000 as const;
const THUMBNAIL_HEIGHT = 600 as const;
const IMAGE_WIDTH = 1280 as const;
const IMAGE_HEIGHT = 600 as const;
const IMAGE_URL_BASE = '/api/image' as const;

export const getAllImageUrls = cache(async () => {
  const ids = await getAllImageIds();
  imageLinks = new Array<GalleryItem>(ids.length);

  for (let i = 0; i < ids.length; i++) {
    imageLinks[i] = {
      original: `${IMAGE_URL_BASE}?id=${
        ids[i] as string
      }&width=${IMAGE_WIDTH}&height=${IMAGE_HEIGHT}`,
      thumbnail: `${IMAGE_URL_BASE}?id=${
        ids[i] as string
      }&width=${IMAGE_WIDTH}&height=${IMAGE_HEIGHT}`,
      originalWidth: IMAGE_WIDTH,
      originalHeight: IMAGE_HEIGHT,
      thumbnailWidth: IMAGE_WIDTH,
      thumbnailHeight: IMAGE_HEIGHT,
    };
  }

  return imageLinks;
});

export const getImageById = cache(getImageByIdFromDb);

export function preloadImages() {
  void getAllImageIds().then((ids) => Promise.all([ids.map(getImageById)]));
}
