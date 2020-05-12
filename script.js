module.exports = function Carousel(target, options) {
  const responsive = options.responsive
  const container = document.querySelector(target)
  const carousel = {}
  let slidePerFrame = options.slidePerFrame || 1
  for(let breakpoint in responsive.breakPoints) {
    if (breakpoint <= window.innerWidth) {
      slidePerFrame = responsive.breakPoints[breakpoint].slidePerFrame
    }
  }
  const styleContainer = {
    'position': 'relative',
    'display': 'flex',
    'overflow': 'hidden'
  }
  const styleItem = {
    'display': 'flex',
    'flex': '0 0 auto',
    'position': 'absolute',
    'transition': 'transform 1.5s ease-in-out 0s'
  }
  let animationState = true
  let timeStart = Date.now()
  let ligado = true
  let timerId = -1
  let sleep = 0
  carousel.loop = (seed = 5000) => {
    sleep = seed
    if (!options.loop || !ligado) return
    if(Date.now() - timeStart > seed) {
      timeStart = Date.now()
      handlerNext()
    }
    cancelAnimationFrame(timerId)
    timerId = requestAnimationFrame((e) => {
      carousel.loop(seed)
    })
  }
  function applyStyle(styles, element) {
    for (let prop in styles) {
      element.style[prop] = styles[prop]
    }
  }
  applyStyle(styleContainer, container)
  let border = container.getBoundingClientRect().left

  function setup() {
    let posX = 0
    let _w = container.getBoundingClientRect().width / slidePerFrame
    if (container.children.length > 0) {
      container.style.height = container.children[0].getBoundingClientRect().height + 'px'
    }
    container.addEventListener('mouseenter', handlerSetupEnter, false)
    container.addEventListener('mouseleave', handlerSetupOver, false)
    container.addEventListener('touchstart', handlerSetupEnter, false)
    container.addEventListener('touchend', handlerSetupOver, false)
    Array.from(container.children).forEach((item, index) => {
      if (index === 0) {
        border = Math.abs(border - item.getBoundingClientRect().left)
      }
      item.style.width = `${_w}px`
      item.style.transform = `translateX(${posX}px)`
      posX += _w
      applyStyle(styleItem, item)
    })
    let back = document.querySelector(options.controllers.back || '#back')
    back.addEventListener('click', handlerBack)

    let next = document.querySelector(options.controllers.next || '#next')
    next.addEventListener('click', handlerNext)
  }
  function resetup () {
    cancelAnimationFrame(timerId)
    animationState = true
    timeStart = Date.now()
    let posA = 0
    for(let breakpoint in options.responsive.breakPoints) {
      let value = parseFloat(breakpoint)
      let _winWidth = window.innerWidth
      if (_winWidth > posA && (_winWidth >= value || _winWidth <= value)) {
        slidePerFrame = options.responsive.breakPoints[breakpoint].slidePerFrame
      }
      posA = value
    }
    let back = document.querySelector(options.controllers.back || '#back')
    back.removeEventListener('click', handlerBack)

    let next = document.querySelector(options.controllers.next || '#next')
    next.removeEventListener('click', handlerNext)
    ligado = true
    setup()
  }
  function handlerSetupEnter (e) {
    ligado = false
  }
  function handlerSetupOver (e) {
    timeStart = Date.now()
    ligado = true
    const _timeId = setTimeout(() => {
      carousel.loop()
      clearTimeout(_timeId)
    }, 1000)
  }
  function handlerNext() {
    if (!animationState) return
    timeStart = Date.now()
    const left = container.getBoundingClientRect().left + border
    Array.from(container.children).forEach(item => {
      let clientRect = item.getBoundingClientRect()
      let posX = clientRect.left - left - clientRect.width
      item.style.transform = `translateX(${posX}px)`
    })
    let item = container.children[0]
    item.addEventListener('transitionstart', (e) => {
      timeStart = Date.now()
      animationState = false
    })
    item.addEventListener('transitionend', (e) => {
      timeStart = Date.now()
      let node = item.cloneNode(true)
      let clientRect = container.children[container.children.length - 1].getBoundingClientRect()
      let posX = clientRect.right - left
      node.style.transform = `translateX(${posX}px)`
      container.appendChild(node)
      container.removeChild(item)
      animationState = true

    })
  }

  function handlerBack() {
    if (!animationState) return
    timeStart = Date.now()
    const left = container.getBoundingClientRect().left + border
    Array.from(container.children).forEach(item => {
      let clientRect = item.getBoundingClientRect()
      let posX = clientRect.right - left
      item.style.transform = `translateX(${posX}px)`
    })
    let item = container.children[container.children.length - 1]
    item.addEventListener('transitionstart', (e) => {
      timeStart = Date.now()
      animationState = false
      let node = item.cloneNode(true)
      let clientRect = container.children[0].getBoundingClientRect()
      let posX = clientRect.left - left
      node.style.transform = `translateX(${posX}px)`
      container.insertBefore(node, container.children[0])
    })

    item.addEventListener('transitionend', (e) => {
      timeStart = Date.now()
      container.removeChild(item)
      animationState = true
    })
  }
  window.addEventListener('resize', (e) => {
    ligado = false
    resetup()
  })
  setup()
  const _timeId = setTimeout(() => {
    carousel.loop()
    clearTimeout(_timeId)
  }, 1000)
  return carousel
}


let carousel = Carousel('.carousel', {
  slidePerFrame: 1,
  loop: true,
  responsive: {
    breakPoints: {
      768: {
        slidePerFrame: 1
      },
      900: {
        slidePerFrame: 5
      }
    },
  },
  controllers: {
    back: '#carousel-back',
    next: '#carousel-next'
  }
})


carousel.loop(5000)