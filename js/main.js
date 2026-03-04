// Adiciona rolagem suave (smooth scroll) aos links internos
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
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Função para aplicar animação nos cards gerados dinamicamente
function animateCards() {
    document.querySelectorAll('.benefit-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.5s ease ${index * 0.1}s`;
        observer.observe(card);
    });
}
// Roda para os cards padrões que já vem no HTML
animateCards();

// -------------------------------------------------------------
// INTEGRAÇÃO COM O DECAP CMS (Carregando os dados)
// -------------------------------------------------------------
fetch('conteudo.json')
    .then(response => {
        if (!response.ok) throw new Error("Ainda não há conteúdo do CMS publicado.");
        return response.json();
    })
    .then(data => {
        // Atualiza a seção Hero
        if (data.hero) {
            if (data.hero.bg_image) document.getElementById('hero-section').style.backgroundImage = `url('${data.hero.bg_image}')`;
            if (data.hero.badge) document.getElementById('hero-badge').innerText = data.hero.badge;
            if (data.hero.title) document.getElementById('hero-title').innerText = data.hero.title;
            if (data.hero.text) document.getElementById('hero-text').innerText = data.hero.text;
        }

        // Atualiza os Benefícios
        if (data.benefits && data.benefits.length > 0) {
            const grid = document.getElementById('benefits-grid');
            grid.innerHTML = ''; // Limpa os hardcoded
            data.benefits.forEach((b) => {
                grid.innerHTML += `
                <div class="benefit-card">
                    <i class="${b.icon}"></i>
                    <h3>${b.title}</h3>
                    <p>${b.text}</p>
                </div>`;
            });
            animateCards(); // Reaplica a animação nos novos cards
        }

        // Atualiza os Serviços com Carrossel Swiper
        if (data.services && data.services.length > 0) {
            const grid = document.getElementById('services-grid');
            grid.innerHTML = ''; 
            data.services.forEach(s => {
                grid.innerHTML += `
                <div class="swiper-slide service-item">
                    <img src="${s.image}" alt="${s.title}" class="img-placeholder">
                    <h3>${s.title}</h3>
                </div>`;
            });
            
            // Inicia o Carrossel de Especialidades
            new Swiper('.services-swiper', {
                slidesPerView: 1,
                spaceBetween: 20,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                breakpoints: {
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 }
                }
            });
        }

        // Atualiza Serviço Extra (Extratora) com Carrossel Swiper
        if (data.extra) {
            if (data.extra.title) document.getElementById('extra-title').innerText = data.extra.title;
            if (data.extra.text) document.getElementById('extra-text-content').innerHTML = `<p>${data.extra.text}</p>`;
            
            const extraWrapper = document.getElementById('extra-image-wrapper');
            extraWrapper.innerHTML = '';
            
            // Lê o formato novo de lista de imagens, ou cai pro formato antigo de 1 imagem só
            const extraImages = data.extra.images || (data.extra.image ? [{image: data.extra.image}] : []);
            
            extraImages.forEach(item => {
                extraWrapper.innerHTML += `
                <div class="swiper-slide">
                    <img src="${item.image}" alt="Serviço Extra" class="img-placeholder extratora-img">
                </div>`;
            });

            // Inicia o Carrossel Extra (autoplay)
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
    .catch(error => console.log("Site carregado com dados do HTML padrão.", error));