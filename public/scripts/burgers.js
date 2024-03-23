const navigation = document.querySelectorAll('nav a')
let scrollBack = 0
const local = 'http://localhost:3000/'
const web = 'https://web-9p7n.onrender.com/'
const cart = {}
const allProductsData = {}
const cart_count = document.getElementById('cart-count')
const cartProducts = document.getElementById('cart-products')
const inCart = {}

function fetchAndRenderMenuData(menuType) {
    fetch(`${local}get${menuType.slice(1)}`)
        .then(res => res.text())
        .then(d => {
            let arr = JSON.parse(d)
            document.getElementById('menudata').innerHTML = arr.map(li => {
                cart[li.id] = 1
                allProductsData[li.id] = li
                return `<li data-id='${li.id}'>
            <img src="${li.imgpath}" alt="">
            <p>${li.price}грн</p>
            <p>${li.title}</p>
            <p>${li.weight}</p>
            <button>Добавить</button>
            </li>`
            }).join('')
        })
        .catch(err => console.log(err))
        .finally(() => {
            // console.log(cart);
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

function currentNav() {
    let prev = null
    document.querySelector('nav').onclick = (e) => {
        let li = e.target.closest('li')
        if (!li) {
            return
        }
        if (prev) {
            prev.style.backgroundColor = ''
        }
        li.style.backgroundColor = '#FFAB08'
        prev = li
    }
}

currentNav()

window.addEventListener('popstate', function (event) {
    fetchAndRenderMenuData(event.state.path);
});

document.getElementById('close-overlay').onclick = () => {
    hideOverlay()
}

document.querySelector('#menudata').onclick = (e) => {
    let btn = e.target.closest('button')
    if (!btn) {
        return
    }
    let id = btn.parentElement.dataset.id
    let product = allProductsData[id]
    let div = document.createElement('div')
    div.id = 'product-wrapper'
    div.dataset.id = product.id
    div.innerHTML = `
    <h2>${product.title}</h2>
    <figure>
        <img src="${product.imgpath}" alt="">
        <figcaption>
            <p>${product.description}</p>
            <dl>
                <dt>Состав:</dt>
                <dd>Пшеничная булочка</dd>
                <dd>Котлета из говядины</dd>
                <dd>Красный лук</dd>
                <dd>Листья салата</dd>
                <dd>Соус горчичный</dd>
            </dl>
            <span>${product.weight}г, ккал ${product.calories}</span>
        </figcaption>
    </figure>

    <div class="single-product-btns">
        <button class="btn-darkorange add-to-cart-btn">Добавить</button>
        <div class="minus-plus">
            <button id="minus">-</button>
            <div id='single-product-${id}'>${cart[product.id]}</div>
            <button id="plus">+</button>
        </div>
        <p>${product.price}грн</p>
    </div>`
    document.querySelector('.single-product').innerHTML = ''
    document.querySelector('.single-product').append(div)
    document.querySelector('.single-product').style.display = 'block'
    openOverlay()
}

document.getElementById('makeorder').onclick = () => {
    openOverlay()
    document.querySelector('.delivery-modal').style.display = 'flex'
}

function hideOverlay() {
    document.getElementById('overlay').style.visibility = 'hidden'
    document.documentElement.classList.remove('global-scrollblock')
    document.documentElement.style.top = ''
    window.scrollTo(0, scrollBack)
    document.querySelector('.delivery-modal').style.display = 'none'
}

function openOverlay() {
    document.documentElement.style.top = -scrollY + 'px'
    scrollBack = scrollY
    document.documentElement.classList.add('global-scrollblock')
    document.getElementById('overlay').style.visibility = 'visible'
}

document.getElementById('dostavka').onclick = () => {
    document.getElementById('delivery-address').style.display = 'flex'
}
document.getElementById('samoviviz').onclick = () => {
    document.getElementById('delivery-address').style.display = 'none'
}

document.querySelector('.single-product').onclick = (e) => {
    let id = document.getElementById('product-wrapper').dataset.id
    let btn = e.target.closest('.add-to-cart-btn');
    let plus = e.target.closest('#plus');
    let minus = e.target.closest('#minus');
    let counter = document.getElementById('single-product-' + id)
    if (!btn && !plus && !minus) {
        return
    }

    if (plus) {
        if (inCart[id]) {
            cart[id] += 1
            document.getElementById(`cartProducts-${id}`).textContent = cart[id]
            counter.textContent = cart[id]
        }
        else {
            cart[id] += 1
            counter.textContent = cart[id]
        }
        // cart_count.textContent = +cart_count.textContent + 1
    }
    if (minus) {
        if (inCart[id]) {
            cart[id] -= 1
            document.getElementById(`cartProducts-${id}`).textContent = cart[id]
            counter.textContent = cart[id]
        } else {
            cart[id] -= 1
            counter.textContent = cart[id]
        }
        // cart_count.textContent = +cart_count.textContent - 1
    }
    if (btn) {
        if (inCart[id] == undefined) {
            let li = `<li data-id='${id}'>
        <img src="${allProductsData[id].imgpath}" alt="">
        <section>
            <p>${allProductsData[id].title}</p>
            <p>${allProductsData[id].weight}</p>
            <p>${allProductsData[id].price}грн</p>
        </section>
        <div class="minus-plus">
            <button id="aside-minus">-</button>
            <div id='cartProducts-${id}'>${cart[id]}</div>
            <button id="aside-plus">+</button>
        </div>
        </li>
        `
            cartProducts.innerHTML += li
            document.getElementById('cart-empty').style.display = 'none'
            hideOverlay()
            setCartProductsListeners()
            inCart[id] = allProductsData[id]
        } else {
            hideOverlay()
        }
    }
}

function setCartProductsListeners() {
    for (let i = 0; i < cartProducts.children.length; i++) {
        cartProducts.children[i].onclick = (e) => {
            let id = cartProducts.children[i].dataset.id
            let counter = document.getElementById('cartProducts-' + id)
            let plus = e.target.closest('#aside-plus');
            let minus = e.target.closest('#aside-minus');
            if (!plus && !minus) {
                return
            }
            if (plus) {
                cart[id] += 1
                counter.textContent = cart[id]
                // cart_count.textContent = +cart_count.textContent + 1
            }
            if (minus) {
                cart[id] -= 1
                counter.textContent = cart[id]
                // cart_count.textContent = +cart_count.textContent - 1
            }
        }
    }
}
setCartProductsListeners()