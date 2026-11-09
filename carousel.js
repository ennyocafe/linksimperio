// Carousel — atualiza dots conforme o usuário arrasta
(function () {
  const track = document.getElementById('carouselTrack')
  const dotsContainer = document.getElementById('carouselDots')
  if (!track || !dotsContainer) return

  const slides = track.querySelectorAll('.carousel__slide')
  if (slides.length <= 1) return

  // Cria dots para cada slide
  dotsContainer.innerHTML = ''
  slides.forEach((_, i) => {
    const dot = document.createElement('button')
    dot.className = 'dot' + (i === 0 ? ' dot--active' : '')
    dot.setAttribute('aria-label', `Slide ${i + 1}`)
    dot.addEventListener('click', () => {
      slides[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
    })
    dotsContainer.appendChild(dot)
  })

  const dots = dotsContainer.querySelectorAll('.dot')

  function updateDots() {
    const slideWidth = slides[0].offsetWidth + 16 // gap
    const index = Math.round(track.scrollLeft / slideWidth)
    dots.forEach((d, i) => {
      d.classList.toggle('dot--active', i === index)
    })
  }

  track.addEventListener('scroll', updateDots, { passive: true })
})()
