history.scrollRestoration = 'manual'

window.AOS.init({
  offset: 200,
  duration: 500,
  easing: 'ease-in'
})

window.Modal = {
  config: {
    disableFocus: true,
    disableScroll: true,
    awaitOpenAnimation: true,
    awaitCloseAnimation: true
  },

  init(config) {
    MicroModal.init(this._assign(config))
  },

  show(id, config) {
    MicroModal.show(id, this._assign(config))
  },

  close(id, config) {
    MicroModal.close(id, this._assign(config))
  },

  _assign(config) {
    return Object.assign({}, this.config, config)
  }
}

window.Modal.init()


document.addEventListener('DOMContentLoaded', () => {

  const setGlobalProperties = () => {
    const doc = document.documentElement
    const header = document.querySelector('header.header')

    doc.style.setProperty('--app-height', `${window.innerHeight}px`)
    if (header) doc.style.setProperty('--app-header', `${header.offsetHeight}px`)
  }

  setGlobalProperties()
  window.addEventListener('load', setGlobalProperties)
  window.addEventListener('resize', setGlobalProperties)

  document.querySelectorAll('.header').forEach(element => {
    let lastScroll = 0
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset

      if (currentScroll <= 0) {
        element.classList.remove('scroll-up')
        return
      }

      element.classList.toggle('scroll-up', currentScroll < lastScroll)
      element.classList.toggle('scroll-down', currentScroll > lastScroll)

      lastScroll = currentScroll
    })
  })

  document.querySelectorAll('.navigation').forEach(element => {
    const menu = element.querySelector('.navigation-box')

    element.querySelectorAll('.navigation-trigger').forEach(trigger => {
      trigger.addEventListener('click', event => menu.classList.toggle('is-visible'))
    })

    element.querySelectorAll('.navigation-body a').forEach(link => {
      link.addEventListener('click', event => menu.classList.remove('is-visible'))
    })
  })

  new Swiper('[data-swiper=slider-1]', {
    loop: true,
    slidesPerView: 1.69,
    spaceBetween: 20,

    pagination: {
      clickable: true,
      el: '.swiper-pagination'
    },

    navigation: false
  })

  new Swiper('[data-swiper=slider-2]', {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 32,

    pagination: {
      clickable: true,
      el: '.swiper-pagination'
    },

    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    }
  })
})

document.addEventListener('DOMContentLoaded', () => {
  const elements = document.querySelectorAll('[data-count]')

  const observer = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) {
      const entry = entries.find(entry => entry.isIntersecting)
      const count = parseInt(entry.target.innerText) || 3

      elements.forEach(element => {
        observer.unobserve(element)

        setTimeout(() => element.innerHTML = count - 1, 750)
        setTimeout(() => element.innerHTML = count - 2, 90000)
      })
    }
  })

  elements.forEach(element => observer.observe(element))
})
