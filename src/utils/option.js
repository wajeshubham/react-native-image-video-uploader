export const imageOptions = {
  mediaType: 'photo',
  title: 'Select an image',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
  quality: 0.7,
  maxWidth: 800,
  maxHeight: 800,
};

export const videoOptions = {
  mediaType: 'video',
  title: 'Select a video',
  storageOptions: {
    skipBackup: true,
    path: 'videos',
  },
  videoQuality: 'low',
  durationLimit: 60,
};
