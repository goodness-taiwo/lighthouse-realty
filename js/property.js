const params = new URLSearchParams(window.location.search)
const id = params.get('id')
console.log(id)

const property = properties.find(property => property.id === Number(id))
console.log(property)

const propertyTitle = document.getElementById('property-title')
const propertyLocation = document.getElementById('property-location')
const propertyStatus = document.getElementById('property-status')
const propertyBeds = document.getElementById('property-beds')
const propertyBaths = document.getElementById('property-baths')
const propertySize = document.getElementById('property-size')
const propertyType = document.getElementById('property-type')
const propertyDescription = document.getElementById('property-description')
const propertyPrice = document.getElementById('property-price')
const propertyBadge = document.getElementById('property-badge')



propertyTitle.textContent = property.title
propertyLocation.textContent = property.location
propertyStatus.textContent = property.status
propertyBeds.textContent = property.bedrooms
propertyBaths.textContent = property.bathrooms
propertySize.textContent = property.size
propertyType.textContent = property.type
propertyDescription.textContent = property.description
propertyPrice.textContent = formatPrice(property.price, property.status)
propertyBadge.textContent = property.badge

// Build image gallery
const mainImg = document.getElementById('gallery-main-img')
const thumbsContainer = document.getElementById('gallery-thumbs')

mainImg.src = property.images[0]
mainImg.alt = property.title

property.images.forEach((img, index) => {
  const thumb = document.createElement('img')
  thumb.src = img
  thumb.alt = `${property.title} - image ${index + 1}`
  thumb.classList.add('gallery-thumb')
  if (index === 0) thumb.classList.add('active')
  
  thumb.addEventListener('click', () => {
    mainImg.src = img
    document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'))
    thumb.classList.add('active')
  })

  thumbsContainer.appendChild(thumb)
})



// Gallery arrows
const galleryPrev = document.querySelector('.gallery-prev')
const galleryNext = document.querySelector('.gallery-next')
let currentImageIndex = 0

galleryPrev.addEventListener('click', () => {
  currentImageIndex = (currentImageIndex - 1 + property.images.length) % property.images.length
  mainImg.src = property.images[currentImageIndex]
  document.querySelectorAll('.gallery-thumb').forEach((t, i) => {
    t.classList.toggle('active', i === currentImageIndex)
  })
})

galleryNext.addEventListener('click', () => {
  currentImageIndex = (currentImageIndex + 1) % property.images.length
  mainImg.src = property.images[currentImageIndex]
  document.querySelectorAll('.gallery-thumb').forEach((t, i) => {
    t.classList.toggle('active', i === currentImageIndex)
  })
})

// Initialize map
const map = L.map('map').setView([property.lat, property.lng], 14)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map)

L.marker([property.lat, property.lng])
  .addTo(map)
  .bindPopup(`<b>${property.title}</b><br>${property.location}`)
  .openPopup()