const navigation = document.querySelectorAll('nav a')
let scrollBack = 0
const local = 'http://localhost:3000/'
const web = 'https://your-meal.onrender.com/'
const allProductsData = {}
const cart_count = document.getElementById('cart-count')
const cartProducts = document.getElementById('cart-products')
let inCart = {}
let isHidden = false

function fetchAndRenderMenuData(menuType) {
    fetch(`${web}get${menuType.slice(1)}`)
        .then(res => res.text())
        .then(d => {
            let arr = JSON.parse(d)
            inCart = getCartFromLocal() || {}
            document.getElementById('menudata').innerHTML = arr.map(li => {
                if (!allProductsData[li.id]) {
                    allProductsData[li.id] = li
                }
                if (inCart && inCart[li.id]) {
                    allProductsData[li.id].qunt = inCart[li.id].qunt
                } else {
                    allProductsData[li.id].qunt = 1
                }
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
            currentNav(menuType)
            cartProducts.innerHTML = ''
            for (const key in inCart) {
                if (!allProductsData[key]) {
                    allProductsData[key] = { ...inCart[key] }
                }
                let li = `<li data-id='${inCart[key].id}'>
                <img src="${inCart[key].imgpath}" alt="">
                <section>
                    <p>${inCart[key].title}</p>
                    <p>${inCart[key].weight}</p>
                    <p>${inCart[key].price}грн</p>
                </section>
                <div class="minus-plus">
                    <button id="minus-${inCart[key].id}">-</button>
                    <div id='cartProducts-${inCart[key].id}'>${inCart[key].qunt}</div>
                    <button id="plus-${inCart[key].id}">+</button>
                </div>
                </li>
                `
                cartProducts.innerHTML += li
            }
            if (Object.keys(inCart).length) {
                document.getElementById('cart-empty').style.display = 'none'
                setCartProductsListeners()
                getCartFromLocal()
            }
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

function currentNav(path) {
    let prev = null
    if (path) {
        navigation.forEach(item => {
            if (item.getAttribute('href') == path) {
                item.style.backgroundColor = '#FFAB08'
                prev = item
            } else {
                item.style.backgroundColor = ''
            }
        })
    }
    document.querySelector('nav').onclick = (e) => {
        let a = e.target.closest('a')
        if (!a) {
            return
        }
        if (prev) {
            prev.style.backgroundColor = ''
        }
        a.style.backgroundColor = '#FFAB08'
        prev = a
    }
}

currentNav()

window.addEventListener('popstate', function (event) {
    if (event.state && event.state.path != null) {
        fetchAndRenderMenuData(event.state.path);
    } else {
        fetchAndRenderMenuData('/');
    }
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
    <div class="prod-img-wrap"><img src="${product.imgpath}" alt=""></div>
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
            <div id='single-product-${id}'>${allProductsData[product.id].qunt}</div>
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
        if (inCart && inCart[id]) {
            inCart[id].qunt += 1
            allProductsData[id].qunt += 1
            document.getElementById(`cartProducts-${id}`).textContent = allProductsData[id].qunt
            counter.textContent = allProductsData[id].qunt
            cart_count.textContent = +cart_count.textContent + 1
        }
        else {
            allProductsData[id].qunt += 1
            counter.textContent = allProductsData[id].qunt
        }
    }
    if (minus) {
        if (parseInt(counter.textContent) < 2) {
            return
        }
        if (inCart && inCart[id]) {
            inCart[id].qunt -= 1
            allProductsData[id].qunt -= 1
            document.getElementById(`cartProducts-${id}`).textContent = allProductsData[id].qunt
            counter.textContent = allProductsData[id].qunt
            cart_count.textContent = +cart_count.textContent - 1
        } else {
            allProductsData[id].qunt -= 1
            counter.textContent = allProductsData[id].qunt
        }
    }
    if (btn) {
        if (!inCart || inCart[id] == undefined) {
            let li = `<li data-id='${id}'>
        <img src="${allProductsData[id].imgpath}" alt="">
        <section>
            <p>${allProductsData[id].title}</p>
            <p>${allProductsData[id].weight}</p>
            <p>${allProductsData[id].price}грн</p>
        </section>
        <div class="minus-plus">
            <button id="minus-${id}">-</button>
            <div id='cartProducts-${id}'>${allProductsData[id].qunt}</div>
            <button id="plus-${id}">+</button>
        </div>
        </li>
        `
            cartProducts.innerHTML += li
            cart_count.textContent = +cart_count.textContent + +counter.textContent
            document.getElementById('cart-empty').style.display = 'none'
            hideOverlay()
            setCartProductsListeners()
            inCart[id] = { ...allProductsData[id] }
            sumPrice()
            saveCartToLocal()

        } else {
            sumPrice()
            saveCartToLocal()
            hideOverlay()
        }
    }
}

function setCartProductsListeners() {
    for (let i = 0; i < cartProducts.children.length; i++) {
        cartProducts.children[i].onclick = (e) => {
            let id = cartProducts.children[i].dataset.id
            let counter = document.getElementById('cartProducts-' + id)
            let plus = e.target.closest('#plus-' + id)
            let minus = e.target.closest('#minus-' + id)
            if (!plus && !minus) {
                return
            }
            if (plus) {
                inCart[id].qunt += 1
                allProductsData[id].qunt += 1
                counter.textContent = allProductsData[id].qunt
                cart_count.textContent = +cart_count.textContent + 1
                sumPrice()
                saveCartToLocal()
            }
            if (minus) {
                if (parseInt(counter.textContent) < 2) {
                    return
                }
                inCart[id].qunt -= 1
                allProductsData[id].qunt -= 1
                counter.textContent = allProductsData[id].qunt
                cart_count.textContent = +cart_count.textContent - 1
                sumPrice()
                saveCartToLocal()
            }
        }
    }
}

function saveCartToLocal() {
    localStorage.setItem('cart', JSON.stringify(inCart))
    localStorage.setItem('items', JSON.stringify(cart_count.textContent))
    localStorage.setItem('sum', JSON.stringify(document.getElementById('cart-total-price').textContent))
}

function getCartFromLocal() {
    if (JSON.parse(localStorage.getItem('items'))) {
        cart_count.textContent = JSON.parse(localStorage.getItem('items'))
        document.getElementById('cart-total-price').textContent = JSON.parse(localStorage.getItem('sum'))
        sumPrice()
    }
    return JSON.parse(localStorage.getItem('cart'))
}

function sumPrice() {
    let sum = 0
    for (const key in inCart) {
        sum += inCart[key].price * inCart[key].qunt
    }
    document.getElementById('cart-total-price').textContent = sum + ' грн.'

    if (parseInt(document.getElementById('cart-total-price').textContent) > 0) {
        document.querySelector('.wrapper').style.display = 'grid'
    } else {
        document.querySelector('.wrapper').style.display = 'none'
    }
    if (parseInt(document.getElementById('cart-total-price').textContent) >= 1500) {
        document.getElementById('free-delivery').style.display = 'flex'
    } else {
        document.getElementById('free-delivery').style.display = 'none'
    }
}

document.getElementById('hide-delivery').onclick = () => {
    document.querySelector('.inner').style.overflow = 'hidden'
    document.querySelector('.wrapper').classList.remove('is-open')
    setTimeout(() => isHidden = true, 400)
}
document.querySelector('aside').onclick = () => {
    if (isHidden) {
        document.querySelector('.wrapper').classList.add('is-open')
        setTimeout(() => {
            isHidden = false
            document.querySelector('.inner').style.overflow = 'visible'
        }, 400)

    }
}
