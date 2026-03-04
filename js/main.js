// Adiciona rolagem suave (smooth scroll)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Animação simples (Intersection Observer)
const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

function animateCards() {
    document.querySelectorAll('.benefit-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.5s ease ${index * 0.1}s`;
        observer.observe(card);
    });
}
animateCards();

// INTEGRAÇÃO DE DADOS
fetch('conteudo.json')
    .then(response => {
        if (!response.ok) throw new Error("Ainda não há conteúdo.");
        return response.json();
    })
    .then(data => {
        // Hero
        if (data.hero) {
            if (data.hero.bg_image) document.getElementById('hero-section').style.backgroundImage = `url('${data.hero.bg_image}')`;
            if (data.hero.badge) document.getElementById('hero-badge').innerText = data.hero.badge;
            if (data.hero.title) document.getElementById('hero-title').innerText = data.hero.title;
            if (data.hero.text) document.getElementById('hero-text').innerText = data.hero.text;
        }

        // Benefícios
        if (data.benefits && data.benefits.length > 0) {
            const grid = document.getElementById('benefits-grid');
            grid.innerHTML = '';
            data.benefits.forEach((b) => {
                grid.innerHTML += `
                <div class="benefit-card">
                    <i class="${b.icon}"></i>
                    <h3>${b.title}</h3>
                    <p>${b.text}</p>
                </div>`;
            });
            animateCards();
        }

        // SERVIÇOS: Grid de cards, cada um com seu próprio carrossel
        if (data.services && data.services.length > 0) {
            const grid = document.getElementById('services-grid');
            grid.innerHTML = '';

            data.services.forEach((s, index) => {
                // Prepara as imagens do serviço (agora é uma lista)
                const images = s.images || (s.image ? [{ image: s.image }] : []);
                let slidesHTML = '';

                images.forEach(img => {
                    slidesHTML += `
                    <div class="swiper-slide">
                        <img src="${img.image}" alt="${s.title}" class="img-placeholder service-img">
                    </div>`;
                });

                grid.innerHTML += `
                <div class="service-card">
                    <div class="swiper swiper-service-${index}">
                        <div class="swiper-wrapper">
                            ${slidesHTML}
                        </div>
                        <div class="swiper-pagination"></div>
                        <div class="swiper-button-next"></div>
                        <div class="swiper-button-prev"></div>
                    </div>
                    <h3>${s.title}</h3>
                </div>`;
            });

            // Inicia o Swiper para CADA UM dos serviços gerados
            data.services.forEach((s, index) => {
                new Swiper(`.swiper-service-${index}`, {
                    slidesPerView: 1,
                    spaceBetween: 0,
                    navigation: {
                        nextEl: `.swiper-service-${index} .swiper-button-next`,
                        prevEl: `.swiper-service-${index} .swiper-button-prev`,
                    },
                    pagination: {
                        el: `.swiper-service-${index} .swiper-pagination`,
                        clickable: true,
                    }
                });
            });
        }

        // Serviço Extra (Extratora)
        if (data.extra) {
            if (data.extra.title) document.getElementById('extra-title').innerText = data.extra.title;
            if (data.extra.text) document.getElementById('extra-text-content').innerHTML = `<p>${data.extra.text}</p>`;

            const extraWrapper = document.getElementById('extra-image-wrapper');
            extraWrapper.innerHTML = '';

            const extraImages = data.extra.images || (data.extra.image ? [{ image: data.extra.image }] : []);

            extraImages.forEach(item => {
                extraWrapper.innerHTML += `
                <div class="swiper-slide">
                    <img src="${item.image}" alt="Serviço Extra" class="img-placeholder extratora-img">
                </div>`;
            });

            new Swiper('.extra-swiper', {
                slidesPerView: 1,
                spaceBetween: 10,
                autoplay: { delay: 3000 },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                }
            });
        }
    })
    .catch(error => console.log("Erro ao carregar os dados:", error));