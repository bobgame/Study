export const setIconTitle = (name: string) => {
  let link = 'favicon.png'
  let title = 'Often - 123'
  if (name === 'bob') {
    link = 'favicon-bob.png'
    title = 'Bob - 123'
  }
  let faviconLink: HTMLLinkElement | null = document.querySelector(
    'link[rel="shortcut icon"]'
  )
  // If a <link rel="icon"> element already exists,
  // change its href to the given link.
  if (faviconLink !== null) {
    faviconLink.href = link
    // Otherwise, create a new element and append it to <head>.
  } else {
    faviconLink = document.createElement('link')
    faviconLink.rel = 'icon'
    faviconLink.href = link
    document.head.appendChild(faviconLink)
  }
  document.title = title // 动态修改网站标题
}
