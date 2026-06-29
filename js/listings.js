// Format price
const formatPrice = (price, status) => {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(price);
  return status === 'For Rent' ? `${formatted}/mo` : formatted;
};

// Create card with image slider for listings page
const createCard = (property) => {
  const images = property.images || [];

  const imageSlides = images.map((img, index) => `
    <div class="slide ${index === 0 ? 'active' : ''}">
      <img src="${img}" alt="${property.title}" class="card-image" loading="lazy"/>
    </div>
  `).join('');

  const dotButtons = images.map((_, index) => `
    <button class="dot ${index === 0 ? 'active' : ''}" data-index="${index}"></button>
  `).join('');

  return `
    <article class="property-card">
      <div class="card-image-wrapper">
        <div class="card-slider">${imageSlides}</div>
        <button class="btn-prev">&#8249;</button>
        <button class="btn-next">&#8250;</button>
        <div class="dots-wrapper">${dotButtons}</div>
        <span class="card-badge badge-${property.badge.toLowerCase().replace(' ', '-')}">${property.badge}</span>
        <span class="card-status">${property.status}</span>
        <button class="card-favorite" aria-label="Save property">&#9825;</button>
      </div>
      <div class="card-body">
        <div class="card-top">
          <span class="card-type">${property.type}</span>
          <span class="card-price">${formatPrice(property.price, property.status)}</span>
        </div>
        <h3 class="card-title">${property.title}</h3>
        <p class="card-location">${property.location}</p>
        <p class="card-description">${property.description}</p>
        <div class="card-features">
          <span>${property.bedrooms} Beds</span>
          <span>${property.bathrooms} Baths</span>
          <span>${property.size.toLocaleString()} sq ft</span>
        </div>
        <div class="card-footer">
          <span class="card-feature-tag">${property.feature}</span>
          <a href="property.html?id=${property.id}" class="card-btn">View Details</a>
        </div>
      </div>
    </article>
  `;
};

// Simple card for homepage
const createSimpleCard = (property) => {
  return `
    <article class="property-card">
      <div class="card-image-wrapper">
        <img src="${property.images[0]}" alt="${property.title}" class="card-image" loading="lazy"/>
        <span class="card-badge badge-${property.badge.toLowerCase().replace(' ', '-')}">${property.badge}</span>
        <span class="card-status">${property.status}</span>
        <button class="card-favorite" aria-label="Save property">&#9825;</button>
      </div>
      <div class="card-body">
        <div class="card-top">
          <span class="card-type">${property.type}</span>
          <span class="card-price">${formatPrice(property.price, property.status)}</span>
        </div>
        <h3 class="card-title">${property.title}</h3>
        <p class="card-location">${property.location}</p>
        <div class="card-features">
          <span>${property.bedrooms} Beds</span>
          <span>${property.bathrooms} Baths</span>
          <span>${property.size.toLocaleString()} sq ft</span>
        </div>
        <a href="property.html?id=${property.id}" class="card-btn">View Details</a>
      </div>
    </article>
  `;
};

// Card observer
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, index * 150);
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

// Image slider
const initSliders = () => {
  document.querySelectorAll('.property-card').forEach(card => {
    const slides = card.querySelectorAll('.slide');
    const dots = card.querySelectorAll('.dot');
    const prevBtn = card.querySelector('.btn-prev');
    const nextBtn = card.querySelector('.btn-next');

    if (!slides.length || !prevBtn || !nextBtn) return;

    let current = 0;

    const goTo = (index) => {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = index;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    };

    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      goTo((current + 1) % slides.length);
    });

    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      goTo((current - 1 + slides.length) % slides.length);
    });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => goTo(i));
    });
  });
};

// Render cards
const renderListings = (list) => {
  const grid = document.getElementById('featured-listings') || document.getElementById('listings-grid');
  if (!grid) return;
  grid.innerHTML = list.map(createCard).join('');
  document.querySelectorAll('.property-card').forEach(card => cardObserver.observe(card));
  initSliders();
};

// Homepage
const featuredGrid = document.getElementById('featured-listings');
if (featuredGrid) {
  const featured = properties.filter(p => p.badge === 'Featured').slice(0, 3);
  featuredGrid.innerHTML = featured.map(createSimpleCard).join('');
  document.querySelectorAll('.property-card').forEach(card => cardObserver.observe(card));
}

// Listings page filters
const searchInput = document.getElementById('search-input');
const filterStatus = document.getElementById('filter-status');
const filterType = document.getElementById('filter-type');
const filterPrice = document.getElementById('filter-price');

const filterProperties = () => {
  const search = searchInput.value.toLowerCase();
  const stat = filterStatus.value.toLowerCase();
  const type = filterType.value.toLowerCase();
  const price = filterPrice.value.toLowerCase();

  const filtered = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(search) ||
                          property.location.toLowerCase().includes(search);
    const matchesStatus = stat === 'all' || property.status.toLowerCase() === stat;
    const matchesType = type === 'all' || property.type.toLowerCase() === type;

    let matchesPrice = true;
    if (price === 'low') matchesPrice = property.price < 5000000;
    if (price === 'mid') matchesPrice = property.price >= 5000000 && property.price <= 10000000;
    if (price === 'high') matchesPrice = property.price > 10000000;

    return matchesSearch && matchesStatus && matchesType && matchesPrice;
  });

  renderListings(filtered);
  const count = document.getElementById('results-count');
  if (count) count.textContent = `Showing ${filtered.length} ${filtered.length === 1 ? 'property' : 'properties'}`;
};

if (searchInput) {
  searchInput.addEventListener('input', filterProperties);
  filterStatus.addEventListener('change', filterProperties);
  filterType.addEventListener('change', filterProperties);
  filterPrice.addEventListener('change', filterProperties);
  filterProperties();
}