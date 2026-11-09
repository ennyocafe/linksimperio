;(function () {
  const overlay     = document.getElementById('talentModal')
  const closeBtn    = document.getElementById('modalClose')
  const openBtn     = document.getElementById('openTalentModal')
  const btnBack     = document.getElementById('modalBtnBack')
  const btnNext     = document.getElementById('modalBtnNext')
  const footer      = document.getElementById('modalFooter')
  const stepperWrap = document.getElementById('modalStepperWrap')
  const stepper     = document.getElementById('modalStepper')
  const successClose= document.getElementById('modalSuccessClose')

  const TOTAL = 4
  let current = 1

  function buildStepper() {
    stepper.innerHTML = ''
    for (let i = 1; i <= TOTAL; i++) {
      const dot = document.createElement('div')
      dot.className = 'modal__step-dot'
      if (i < current) dot.classList.add('is-done')
      if (i === current) dot.classList.add('is-active')
      dot.textContent = i
      stepper.appendChild(dot)
      if (i < TOTAL) {
        const line = document.createElement('div')
        line.className = 'modal__step-line' + (i < current ? ' is-done' : '')
        stepper.appendChild(line)
      }
    }
  }

  function showPane(n) {
    document.querySelectorAll('.modal__pane').forEach(p => { p.hidden = true })
    const pane = document.querySelector('.modal__pane[data-pane="' + n + '"]')
    if (pane) pane.hidden = false

    const isSuccess = n > TOTAL
    footer.hidden = isSuccess
    stepperWrap.hidden = isSuccess

    if (!isSuccess) {
      footer.classList.toggle('hide-back', n === 1)
      btnNext.textContent = n === TOTAL ? 'Enviar candidatura' : 'Próximo'
      buildStepper()
    }

    // scroll to top of body
    const body = document.querySelector('.modal__body')
    if (body) body.scrollTop = 0
  }

  function validateCurrent() {
    const pane = document.querySelector('.modal__pane[data-pane="' + current + '"]')
    let valid = true
    pane.querySelectorAll('[required]').forEach(function (f) {
      f.classList.remove('is-error')
      const empty = f.type === 'checkbox' ? !f.checked : !f.value.trim()
      if (empty) { f.classList.add('is-error'); valid = false }
    })
    return valid
  }

  function getFormData() {
    return {
      nome:         document.getElementById('f-nome').value,
      whatsapp:     document.getElementById('f-whatsapp').value,
      email:        document.getElementById('f-email').value,
      unidade:      document.getElementById('f-unidade').value,
      area:         document.getElementById('f-area').value,
      apresentacao: document.getElementById('f-apresentacao').value,
      habilidades:  document.getElementById('f-habilidades').value,
      motivacao:    document.getElementById('f-motivacao').value,
      data:         new Date().toLocaleString('pt-BR', { timeZone: 'America/Fortaleza' }),
    }
  }

  function sendToWebhook(data) {
    return fetch('https://hook.us2.make.com/v6gfla3ze1nznln5kmhx0b6xznu2e5k6', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  }

  function openModal() {
    current = 1
    document.querySelectorAll('.modal__pane [required]').forEach(function (f) {
      if (f.type === 'checkbox') f.checked = false
      else f.value = ''
      f.classList.remove('is-error')
    })
    stepperWrap.hidden = false
    showPane(1)
    overlay.classList.add('is-open')
    document.body.style.overflow = 'hidden'
  }

  function closeModal() {
    overlay.classList.remove('is-open')
    document.body.style.overflow = ''
  }

  btnNext.addEventListener('click', function () {
    if (!validateCurrent()) return
    if (current === TOTAL) {
      btnNext.disabled = true
      btnNext.textContent = 'Enviando...'
      sendToWebhook(getFormData())
        .then(function () { showPane(TOTAL + 1) })
        .catch(function () { showPane(TOTAL + 1) }) // mostra sucesso mesmo se falhar na rede
        .finally(function () {
          btnNext.disabled = false
          btnNext.textContent = 'Enviar candidatura'
        })
    } else {
      current++
      showPane(current)
    }
  })

  btnBack.addEventListener('click', function () {
    if (current > 1) { current--; showPane(current) }
  })

  openBtn.addEventListener('click', openModal)
  closeBtn.addEventListener('click', closeModal)
  successClose.addEventListener('click', closeModal)
  overlay.addEventListener('click', function (e) { if (e.target === overlay) closeModal() })
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeModal()
  })
})()
