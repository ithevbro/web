document.addEventListener('DOMContentLoaded', function () {
    const header = document.createElement('header');
    header.innerHTML = `
    <section>
        <img id="header-logo" src="./images/logo-header.svg" alt="">
        <figure>
            <img id="burger-logo" src="./images/burger.svg" alt="burger image">
            <figcaption>
                <h1>Только самые<br><span>сочные бургеры!</span></h1>
                <p>Бесплатная доставка от 599грн</p>
            </figcaption>
        </figure>
    </section>
    <nav>
        <ul>
            <li>
                <img src="./images/nav-icons/Бургеры.png" alt="">
                <a href="/">Бургеры</a>
            </li>
            <li>
                <img src="./images/nav-icons/Закуски.png" alt="">
                <a href="/zakuski">Закуски</a>
            </li>
            <li>
                <img src="./images/nav-icons/Хот-доги.png" alt="">
                <a href="/hotdogs">Хот-доги</a>
            </li>
            <li>
                <img src="./images/nav-icons/Комбо.png" alt="">
                <p>Комбо</p>
            </li>
            <li>
                <img src="./images/nav-icons/Шаурма.png" alt="">
                <p>Шаурма</p>
            </li>
            <li>
                <img src="./images/nav-icons/Пицца.png" alt="">
                <p>Пицца</p>
            </li>
            <li>
                <img src="./images/nav-icons/Вок.png" alt="">
                <p>Вок</p>
            </li>
            <li>
                <img src="./images/nav-icons/Десерты.png" alt="">
                <p>Десерты</p>
            </li>
            <li>
                <img src="./images/nav-icons/Соусы.png" alt="">
                <p>Соусы</p>
            </li>
        </ul>
    </nav>
    `
    document.body.insertBefore(header, document.body.firstChild);
    const footer = document.createElement('footer');
    footer.innerHTML = `
    <div><img src="./images/footer-icon.svg" alt=""></div>
    <div>
        <h3>Номер для заказа</h3>
        <p class="zakaz"><img src="./images/footer-icons/Call.png" alt=""><a
                href="+380631111111">+7(930)833-38-11</a></p>
    </div>
    <div>
        <h3>Мы в соцсетях</h3>
        <div class="socials">
            <img src="./images/footer-icons/vk.png" alt="">
            <img src="./images/footer-icons/tg.png" alt="">
        </div>
    </div>
    `
    document.body.appendChild(footer);
})