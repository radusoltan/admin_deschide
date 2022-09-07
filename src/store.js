import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { categories } from './services/categories'
import { articles } from './services/articles'
import { articleImages } from './services/images'
import { imageThumbnails } from './services/imageThumbnails'

export const store = configureStore({
  reducer: {
    [categories.reducerPath]: categories.reducer,
    [articles.reducerPath]: articles.reducer,
    [articleImages.reducerPath]: articleImages.reducer,
    [imageThumbnails.reducerPath]: imageThumbnails.reducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat([
    categories.middleware,
    articles.middleware,
    articleImages.middleware,
    imageThumbnails.middleware
  ])
})

setupListeners(store.dispatch)