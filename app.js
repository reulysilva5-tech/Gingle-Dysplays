const browser = document.getElementById("browser")
const homePage = document.getElementById("homePage")
const urlInput = document.getElementById("url")

let abas = []
let abaAtual = 0

let favoritos =
JSON.parse(localStorage.getItem("favoritos")) || []

let historicoGlobal =
JSON.parse(localStorage.getItem("historico")) || []

function novaAba() {

  abas.push({
    titulo: "Nova aba",
    url: "",
    historico: [],
    indice: -1
  })

  abaAtual = abas.length - 1

  atualizarAbas()
  home()

}

function atualizarAbas() {

  const tabs = document.getElementById("tabs")

  tabs.innerHTML = ""

  abas.forEach((aba, index) => {

    const tab = document.createElement("div")

    tab.className =
      "tab " +
      (index === abaAtual ? "active" : "")

    const title = document.createElement("span")

    title.innerText =
      aba.titulo || "Nova aba"

    const close = document.createElement("span")

    close.innerText = "×"
    close.className = "close-tab"

    close.onclick = (e) => {

      e.stopPropagation()

      fecharAba(index)

    }

    tab.onclick = () => {

      abaAtual = index

      atualizarAbas()

      carregarAba()

    }

    tab.appendChild(title)
    tab.appendChild(close)

    tabs.appendChild(tab)

  })

}

function fecharAba(index) {

  abas.splice(index, 1)

  if (abas.length === 0) {

    novaAba()

    return

  }

  if (abaAtual >= abas.length) {

    abaAtual = abas.length - 1

  }

  atualizarAbas()
  carregarAba()

}

function carregarAba() {

  const aba = abas[abaAtual]

  if (!aba.url) {

    home()

    return

  }

  homePage.style.display = "none"
  browser.style.display = "block"

  browser.src = aba.url

  urlInput.value = aba.url

}

function navegar() {

  let url = urlInput.value.trim()

  abrirURL(url)

}

function abrirURL(url) {

  if (!url) return

  if (
    !url.startsWith("http://") &&
    !url.startsWith("https://")
  ) {

    if (url.includes(".")) {

      url = "https://" + url

    } else {

      url =
      "https://www.google.com/search?q=" +
      encodeURIComponent(url)

    }

  }

  const aba = abas[abaAtual]

  aba.url = url

  aba.titulo =
    url
    .replace("https://", "")
    .replace("http://", "")
    .split("/")[0]

  aba.historico =
    aba.historico.slice(0, aba.indice + 1)

  aba.historico.push(url)

  aba.indice++

  historicoGlobal.unshift(url)

  historicoGlobal =
    historicoGlobal.slice(0, 100)

  localStorage.setItem(
    "historico",
    JSON.stringify(historicoGlobal)
  )

  atualizarAbas()

  homePage.style.display = "none"
  browser.style.display = "block"

  browser.src = url

}

function pesquisarHome() {

  const value =
    document
    .getElementById("homeSearch")
    .value

  urlInput.value = value

  navegar()

}

function abrirAtalho(url) {

  urlInput.value = url

  navegar()

}

function voltar() {

  const aba = abas[abaAtual]

  if (aba.indice > 0) {

    aba.indice--

    aba.url =
      aba.historico[aba.indice]

    carregarAba()

  }

}

function avancar() {

  const aba = abas[abaAtual]

  if (
    aba.indice <
    aba.historico.length - 1
  ) {

    aba.indice++

    aba.url =
      aba.historico[aba.indice]

    carregarAba()

  }

}

function recarregar() {

  if (browser.style.display === "block") {

    browser.src = browser.src

  }

}

function home() {

  const aba = abas[abaAtual]

  aba.url = ""
  aba.titulo = "Nova aba"

  urlInput.value = ""

  browser.style.display = "none"
  homePage.style.display = "flex"

  atualizarAbas()

}

function favoritar() {

  const aba = abas[abaAtual]

  if (!aba.url) return

  if (!favoritos.includes(aba.url)) {

    favoritos.push(aba.url)

    localStorage.setItem(
      "favoritos",
      JSON.stringify(favoritos)
    )

  }

}

function mostrarFavoritos() {

  const panel =
    document.getElementById("sidePanel")

  const title =
    document.getElementById("panelTitle")

  const content =
    document.getElementById("panelContent")

  panel.style.display = "block"

  title.innerText = "Favoritos"

  content.innerHTML = ""

  favoritos.forEach(url => {

    const item =
      document.createElement("div")

    item.className = "panel-item"

    item.innerText = url

    item.onclick = () => abrirURL(url)

    content.appendChild(item)

  })

}

function mostrarHistorico() {

  const panel =
    document.getElementById("sidePanel")

  const title =
    document.getElementById("panelTitle")

  const content =
    document.getElementById("panelContent")

  panel.style.display = "block"

  title.innerText = "Histórico"

  content.innerHTML = ""

  historicoGlobal
    .slice(0, 30)
    .forEach(url => {

      const item =
        document.createElement("div")

      item.className = "panel-item"

      item.innerText = url

      item.onclick = () => abrirURL(url)

      content.appendChild(item)

    })

}

function atualizarRelogio() {

  document.getElementById("clock").innerText =
    new Date().toLocaleTimeString(
      "pt-BR",
      {
        hour: "2-digit",
        minute: "2-digit"
      }
    )

}

setInterval(atualizarRelogio, 1000)

atualizarRelogio()

novaAba()

if ("serviceWorker" in navigator) {

  navigator.serviceWorker.register(
    "./service-worker.js"
  )

}
