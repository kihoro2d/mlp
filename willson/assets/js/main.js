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

  document.querySelectorAll('.promotion-sale-extra').forEach(element => {
    element.innerHTML = element.dataset.value.split('').map((char, i, arr) => {
      return `<span style="transform:rotate(${ (360 / arr.length) * i}deg)">${char}</span>`
    }).join('')
  })

  document.querySelectorAll('.editform').forEach(form => {
    const notice = form.querySelector('.editform-notice')
    const button = form.querySelector('.editform-button')

    form.addEventListener('submit', event => {
      event.preventDefault()

      form.classList.remove('is-editing')

      const formData = new FormData(form)
      formData.append('_type_edit', true)

      fetch(window.location.href, { body: formData, method: 'post' }).then(data => {
        notice.classList.add('is-shown')
        setTimeout(() => notice.classList.remove('is-shown'), 3000)
      })
    })

    button.addEventListener('click', event => {
      if (form.classList.contains('is-editing')) {
        return true
      }

      event.preventDefault()
      form.classList.add('is-editing')
    })
  })

  document.querySelectorAll('[data-disable]').forEach(element => {
    element.addEventListener('click', event => {
      event.target.disabled = true

      if (!event.target.dataset.disable) return
      event.target.innerText = event.target.dataset.disable
    })
  })

  new Swiper('[data-swiper=comparison]', {
    loop: true,
    slidesPerView: 1.33,
    spaceBetween: 12,
    centeredSlides: true,
    noSwipingSelector: '.comparison',

    pagination: {
      clickable: true,
      dynamicBullets: true,
      dynamicMainBullets: 5,
      el: '.swiper-pagination'
    },

    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    }
  })

  new Swiper('[data-swiper=carousel]', {
    loop: true,
    slidesPerView: 1.44,
    spaceBetween: 12,
    centeredSlides: true,

    autoplay: {
      delay: 2000
    },

    pagination: {
      clickable: true,
      dynamicBullets: true,
      dynamicMainBullets: 5,
      el: '.swiper-pagination'
    },

    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    }
  })

  document.querySelectorAll('.comparison').forEach(element => {
    new ImageCompare(element, {
      fluidMode: element.classList.contains('is-fluid'),
      smoothing: false,
      addCircle: true,
    }).mount()
  })
})

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modal-product')
  const content = document.getElementById('modal-product-content')

  document.addEventListener('click', event => {
    const product = event.target.closest('.product')

    if (!product) return

    const button = product.querySelector('button')

    if (event.target.isSameNode(button) || content.contains(product)) return

    const clone = product.cloneNode(true)

    clone.classList.add('is-extanted')
    clone.querySelectorAll('[data-disable]').forEach(element => {
      element.addEventListener('click', event => {
        event.target.disabled = true
        button.disabled = true

        if (!event.target.dataset.disable) return

        event.target.innerText = event.target.dataset.disable
        button.innerText = button.dataset.disable
      })
    })

    Modal.show(modal.id, {
      onShow: () => {
        content.replaceChildren(clone)
        Modal.init()
      }
    })
  })
})

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-swiper=quiz]').forEach(element => {
    const swiper = new Swiper(element, {
      slidesPerView: 1,
      spaceBetween: 20,
      allowTouchMove: false,

      pagination: {
        clickable: true,
        el: '.swiper-pagination'
      }
    })

    const nextButton = swiper.el.querySelector('.swiper-next')
    const sendButton = swiper.el.querySelector('.swiper-send')

    nextButton.disabled = true
    nextButton.addEventListener('click', () => swiper.slideNext())

    sendButton.disabled = true
    sendButton.classList.add('is-hidden')
    sendButton.addEventListener('click', () => {
      const modal = document.getElementById('modal-results')
      const target = modal.getElementsByClassName('formbox')[0]

      if (!modal || !target) return

      Modal.show(modal.id, {
        onClose: () => {
          target.classList.add('shaking')
          swiper.el.parentNode.replaceChild(target, swiper.el)
        }
      })
    })

    swiper.slides.forEach(slide => {
      slide.querySelectorAll('input[type=radio]').forEach(input => {
        input.addEventListener('change', () => {
          nextButton.disabled = false
          sendButton.disabled = false
        })
      })
    })

    swiper.on('slideChange', () => {
      const current = swiper.slides[swiper.activeIndex]
      const checked = current.querySelector('input[type=radio]:checked')

      nextButton.classList.toggle('is-hidden', swiper.isEnd)
      sendButton.classList.toggle('is-hidden', !swiper.isEnd)

      nextButton.disabled = !checked
      sendButton.disabled = !checked
    })
  })
})

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modal-deferred')
  const target = document.querySelectorAll('.section-reviews')[0]

  let deferred = true

  if (!modal || !target) return

  document.querySelectorAll('[data-deferred-cancel').forEach(element => {
    element.addEventListener('click', event => deferred = false)
  })

  const observer = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) {
      entries.forEach(entry => observer.unobserve(entry.target))

      if (!deferred) return

      Modal.show(modal.id)
    }
  })

  observer.observe(target)
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
