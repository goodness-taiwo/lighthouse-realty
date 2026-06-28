// Format price
const formatPrice = (price, status) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  
    return status === 'For Rent' ? `${formatted}/mo` : formatted;
  };
  
  // Create a single property card
  const createCard = (property) => {
    return `
      <article class="property-card">
        <div class="card-image-wrapper">
          <img 
            src="${property.image}" 
            alt="${property.title}"
            class="card-image"
            loading="lazy"
          />
          <span class="card-badge badge-${property.badge.toLowerCase().replace(' ', '-')}">${property.badge}</span>
          <span class="card-status">${property.status}</span>
          <button class="card-favorite" aria-label="Save property">
            ♡
          </button>
        </div>
        <div class="card-body">
          <div class="card-top">
            <span class="card-type">${property.type}</span>
            <span class="card-price">${formatPrice(property.price, property.status)}</span>
          </div>
          <h3 class="card-title">${property.title}</h3>
          <p class="card-location">📍 ${property.location}</p>
          <p class="card-description">${property.description}</p>
          <div class="card-features">
            <span>🛏 ${property.bedrooms} Beds</span>
            <span>🚿 ${property.bathrooms} Baths</span>
            <span>📐 ${property.size.toLocaleString()} sq ft</span>
          </div>
          <div class="card-footer">
            <span class="card-feature-tag">✦ ${property.feature}</span>
            <a href="property.html?id=${property.id}" class="card-btn">View Details</a>
          </div>
        </div>
      </article>
    `;
  };
  
  // Render cards to the page
  const renderListings = (list) => {
    const grid = document.getElementById('featured-listings');
    if (!grid) return;
    grid.innerHTML = list.map(createCard).join('');
  };
  
  // Display featured properties on homepage
  renderListings(properties);


  

// Card scroll animation
const cards = document.querySelectorAll('.property-card');

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

cards.forEach(card => cardObserver.observe(card));