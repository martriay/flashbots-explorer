export const pageview = (url) => {
  window.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
    page_path: 'https://flashbots-explorer.marto.lol',
  });
}

// log specific events happening.
export const event = ({ action, params }) => {
  window.gtag('event', action, params);
}
