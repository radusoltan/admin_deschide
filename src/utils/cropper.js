import {
  centerCrop,
  makeAspectCrop,
} from 'react-image-crop'



export const centerAspectCrop = (
  image,
  aspect
) => (
  centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90
      },
      aspect,
      image.width,
      image.height
    ),
    image.width,
    image.height
  )
)