import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { categories } from './services/categories'
import { articles } from './services/articles'
import { articleImages } from './services/images'
import {Images} from './services/images'
import { imageThumbnails } from './services/imageThumbnails'
import { related } from './services/related'
import { users } from './services/users'
import { roles } from './services/roles'
import { permissions } from './services/permissions'
import {authors} from './services/authors'

export const store = configureStore({
  reducer: {
    [categories.reducerPath]: categories.reducer,
    [articles.reducerPath]: articles.reducer,
    [articleImages.reducerPath]: articleImages.reducer,
    [Images.reducerPath]: Images.reducer,
    [imageThumbnails.reducerPath]: imageThumbnails.reducer,
    [related.reducerPath]: related.reducer,
    [users.reducerPath]: users.reducer,
    [roles.reducerPath]: roles.reducer,
    [permissions.reducerPath]: permissions.reducer,
    [authors.reducerPath]: authors.reducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat([
    categories.middleware,
    articles.middleware,
    articleImages.middleware,
    imageThumbnails.middleware,
    related.middleware,
    users.middleware,
    roles.middleware,
    permissions.middleware,
    authors.middleware
  ])
})

setupListeners(store.dispatch)