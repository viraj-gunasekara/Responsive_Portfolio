const modal = document.getElementById("imageModal");
const mainImage = document.getElementById("mainImage");
const imageIndex = document.getElementById("imageIndex");
const modalClose = document.getElementById("modalCloseBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const thumbs = document.querySelectorAll(".thumb");

let currentIndex = 0;

const images = [
  "assets/img/project-1.jpg",
  "assets/img/project-2.jpg",
  "assets/img/project-3.jpg",
  "assets/img/project-1.jpg",
  "assets/img/project-2.jpg",
  "assets/img/project-3.jpg",
];

function updateModal(index) {
  currentIndex = index;
  mainImage.src = images[index];
  imageIndex.textContent = `${index + 1}/${images.length}`;
  document
    .querySelectorAll(".thumb")
    .forEach((t) => t.classList.remove("active"));
  thumbs[index].classList.add("active");
}

document.querySelectorAll(".open-modal").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const index = parseInt(btn.getAttribute("data-index"));
    updateModal(index);
    modal.classList.remove("hidden");
  });
});

modalClose.addEventListener("click", () => {
  modal.classList.add("hidden");
});

prevBtn.addEventListener("click", () => {
  const index = (currentIndex - 1 + images.length) % images.length;
  updateModal(index);
});

nextBtn.addEventListener("click", () => {
  const index = (currentIndex + 1) % images.length;
  updateModal(index);
});

thumbs.forEach((thumb, i) => {
  thumb.addEventListener("click", () => {
    updateModal(i);
  });
});

// Zoom Logic
let zoomLevel = 1;
const zoomStep = 0.25;
const maxZoom = 3;
const minZoom = 1;

const zoomInBtn = document.querySelector(".ri-zoom-in-line");
const zoomOutBtn = document.querySelector(".ri-zoom-out-line");
const mainImageContainer = document.querySelector(".modal-main-view");

function applyZoom() {
  mainImage.style.transform = `scale(${zoomLevel})`;
  if (zoomLevel > 1) {
    mainImage.classList.add("zoomed");
    mainImageContainer.classList.add("zoomed");
  } else {
    mainImage.classList.remove("zoomed");
    mainImageContainer.classList.remove("zoomed");
  }
}

zoomInBtn.addEventListener("click", () => {
  if (zoomLevel < maxZoom) {
    zoomLevel += zoomStep;
    applyZoom();
  }
});

zoomOutBtn.addEventListener("click", () => {
  if (zoomLevel > minZoom) {
    zoomLevel -= zoomStep;
    applyZoom();
  }
});

// Reset zoom when image changes or modal closes
function resetZoom() {
  zoomLevel = 1;
  applyZoom();
}

modalClose.addEventListener("click", () => {
  resetZoom();
});

// Also call reset when navigating between images
prevBtn.addEventListener("click", () => {
  resetZoom();
});

nextBtn.addEventListener("click", () => {
  resetZoom();
});

thumbs.forEach((thumb, i) => {
  thumb.addEventListener("click", () => {
    resetZoom();
  });
});