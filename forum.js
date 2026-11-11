;(function () {
  const overlay      = document.getElementById('forumModal')
  const openBtn      = document.getElementById('openForumModal')
  const closeBtn     = document.getElementById('forumModalClose')
  const successClose = document.getElementById('forumSuccessClose')
  const btnInscrever = document.getElementById('forumBtnInscrever')
  const footer       = document.getElementById('forumModalFooter')

  const WEBHOOK_URL = 'https://hook.us2.make.com/odvy3xbn8cbyxl4xb8pltuacsw3dyx59'
  const WHATSAPP_NUMBER = '558981347495'

  function showPane(pane) {
    overlay.querySelectorAll('.modal__pane').forEach(function (p) { p.hidden = true })
    overlay.querySelector('.modal__pane[data-pane="' + pane + '"]').hidden = false
    footer.hidden = pane === 'forum-success'
  }

  function validate() {
    var valid = true
    overlay.querySelectorAll('[required]').forEach(function (f) {
      f.classList.remove('is-error')
      if (!f.value.trim()) { f.classList.add('is-error'); valid = false }
    })
    return valid
  }

  function sendToWebhook(data) {
    return fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  }

  function openWhatsApp(nome, numero, empresa) {
    var msg =
      'Oi! Meu nome é ' + nome + ' e represento a empresa ' + empresa + '. ' +
      'Quero participar do fórum da reforma tributária! ' +
      'Vim pelos links da Império Contábil.'
    window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg), '_blank')
  }

  function openModal() {
    overlay.querySelectorAll('[required]').forEach(function (f) {
      f.value = ''
      f.classList.remove('is-error')
    })
    showPane('forum-form')
    overlay.classList.add('is-open')
    document.body.style.overflow = 'hidden'
  }

  function closeModal() {
    overlay.classList.remove('is-open')
    document.body.style.overflow = ''
  }

  btnInscrever.addEventListener('click', function () {
    if (!validate()) return

    var nome    = document.getElementById('ff-nome').value.trim()
    var numero  = document.getElementById('ff-numero').value.trim()
    var empresa = document.getElementById('ff-empresa').value.trim()

    var payload = {
      nome:    nome,
      numero:  numero,
      empresa: empresa,
      evento:  'Fórum da Reforma Tributária — Dom Inocêncio',
      data:    new Date().toLocaleString('pt-BR', { timeZone: 'America/Fortaleza' }),
    }

    btnInscrever.disabled = true
    btnInscrever.textContent = 'Enviando...'

    sendToWebhook(payload)
      .catch(function () { /* segue mesmo se o webhook falhar */ })
      .finally(function () {
        btnInscrever.disabled = false
        btnInscrever.textContent = 'Se inscrever'
        showPane('forum-success')
        openWhatsApp(nome, numero, empresa)
      })
  })

  openBtn.addEventListener('click', openModal)
  closeBtn.addEventListener('click', closeModal)
  successClose.addEventListener('click', closeModal)
  overlay.addEventListener('click', function (e) { if (e.target === overlay) closeModal() })
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeModal()
  })
})()
