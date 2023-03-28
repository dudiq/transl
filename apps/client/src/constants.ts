export const SERVER_API =
  typeof window === 'undefined'
    ? ''
    : `${window.location.protocol}//${window.location.hostname}:5050`
