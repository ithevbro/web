const navigation = document.querySelectorAll('nav a')
let scrollBack = 0

function fetchAndRenderMenuData(menuType) {
    fetch(`http://localhost:3000/get${menuType.slice(1)}`)
        .then(res => res.text())
        .then(d => {
            let arr = JSON.parse(d)
            document.getElementById('menudata').innerHTML = arr.map(li => {
                return `<li>
            <img src="${li.imgpath}" alt="">
            <p>${li.price}грн</p>
            <p>${li.title}</p>
            <p>${li.weight}</p>
            <button>Добавить</button>
            </li>`
            }).join('')
        })
}

fetchAndRenderMenuData(window.location.pathname)

navigation.forEach(item => {
    item.addEventListener('click', function (e) {
        e.preventDefault()
        const path = this.getAttribute('href')
        fetchAndRenderMenuData(path);
        window.history.pushState({ path: path }, '', path);
    });
});

window.addEventListener('popstate', function (event) {
    fetchAndRenderMenuData(event.state.path);
});

document.getElementById('close-overlay').onclick = () => {
    hideOverlay()
}

// document.documentElement.onclick = (e) => {
//     if (e.target.closest('#makeorder') || e.target.closest('.delivery-modal')) {
//         return
//     } else {
//         hideOverlay()
//     }
// }
document.getElementById('makeorder').onclick = () => {
    document.documentElement.style.top = -scrollY + 'px'
    scrollBack = scrollY
    document.documentElement.classList.add('global-scrollblock')
    document.getElementById('overlay').style.visibility = 'visible'
}

function hideOverlay() {
    document.getElementById('overlay').style.visibility = 'hidden'
    document.documentElement.classList.remove('global-scrollblock')
    document.documentElement.style.top = ''
    window.scrollTo(0, scrollBack)
}

document.getElementById('dostavka').onclick = () => {
    document.getElementById('delivery-address').style.display = 'flex'
}
document.getElementById('samoviviz').onclick = () => {
    document.getElementById('delivery-address').style.display = 'none'
}