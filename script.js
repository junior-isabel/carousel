function Carousel(target, options) {
  const container = document.querySelector(target)
  const carousel = {}
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
  carousel.loop = (seed = 5000) => {
    if(Date.now() - timeStart > seed && ligado) {
      timeStart = Date.now()
      handlerNext()
    }
    requestAnimationFrame((e) => {
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
    let _w = container.getBoundingClientRect().width / options.slidePerFrame
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
      posX += item.getBoundingClientRect().width
      applyStyle(styleItem, item)
    })
    let back = document.querySelector('#back')
    back.addEventListener('click', handlerBack)

    let next = document.querySelector('#next')
    next.addEventListener('click', handlerNext)
  }

  function handlerSetupEnter (e) {
    ligado = false
  }
  function handlerSetupOver (e) {
    ligado = true
  }
  function handlerNext() {
    if (!animationState) return
    const left = container.getBoundingClientRect().left + border
    Array.from(container.children).forEach(item => {
      let clientRect = item.getBoundingClientRect()
      let posX = clientRect.left - left - item.offsetWidth
      item.style.transform = `translateX(${posX}px)`
    })
    let item = container.children[0]
    item.addEventListener('transitionstart', (e) => {
      animationState = false
    })
    item.addEventListener('transitionend', (e) => {
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
    const left = container.getBoundingClientRect().left + border
    Array.from(container.children).forEach(item => {
      let clientRect = item.getBoundingClientRect()
      let posX = clientRect.right - left
      item.style.transform = `translateX(${posX}px)`
    })
    let item = container.children[container.children.length - 1]
    item.addEventListener('transitionstart', (e) => {
      animationState = false
      let node = item.cloneNode(true)
      let clientRect = container.children[0].getBoundingClientRect()
      let posX = clientRect.left - left
      node.style.transform = `translateX(${posX}px)`
      container.insertBefore(node, container.children[0])
    })

    item.addEventListener('transitionend', (e) => {
      container.removeChild(item)
      animationState = true
    })
  }

  setup()
  return carousel
}


let carousel = Carousel('.carousel', {
  slidePerFrame: 8,
  controllers: {
    back: null,
    next: null
  }
})


carousel.loop(5000)