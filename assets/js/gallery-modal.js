const modal = document.getElementById("imageModal");
const mainImage = document.getElementById("mainImage");
const imageIndex = document.getElementById("imageIndex");
const modalClose = document.getElementById("modalCloseBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let currentIndex = 0;

// define images per project
const projectImages = {
  "project-1": [
    "assets/img/project-1.jpg",
    "assets/img/project-2.jpg",
    "assets/img/project-3.jpg",
    "assets/img/project-1.jpg",
    "assets/img/project-2.jpg",
    "assets/img/project-3.jpg",
  ],
  "project-2": [
    "assets/img/project-1.jpg",
    "assets/img/project-2.jpg",
    "assets/img/project-3.jpg",
  ],
  "project-3": [
    "assets/img/project-1.jpg",
    "assets/img/project-2.jpg",
    "assets/img/project-3.jpg",
    "assets/img/project-1.jpg",
  ],
  "project-4": [
    "assets/img/project-1.jpg",
    "assets/img/project-2.jpg",
    "assets/img/project-3.jpg",
    "assets/img/project-1.jpg",
  ],
  "project-5": [
    "assets/img/project-1.jpg",
    "assets/img/project-2.jpg",
    "assets/img/project-3.jpg",
    "assets/img/project-1.jpg",
  ],
};

// update global images and regenerate thumbnails dynamically
let images = [];

function updateModal(index) {
  currentIndex = index;

  // Reset thumbnails
  const thumbsWrapper = document.querySelector(".thumbs-wrapper");
  thumbsWrapper.innerHTML = "";

  images.forEach((imgPath, i) => {
    const thumb = document.createElement("img");
    thumb.src = imgPath;
    thumb.className = "thumb" + (i === index ? " active" : "");
    thumb.dataset.index = i;
    thumb.alt = "thumb";

    thumb.addEventListener("click", () => {
      updateModal(i);
      resetZoom();
      resetFitToScreen();
    });

    thumbsWrapper.appendChild(thumb);
  });

  //set main image AFTER thumbnails are added to DOM
  const imagePath = images[index];
  mainImage.src = imagePath;
  imageIndex.textContent = `${index + 1}/${images.length}`;
  imageTitle.textContent = getImageName(imagePath);
}

function getImageName(path) {
  return path.split("/").pop().split(".")[0]; // Extracts "project-3d" from path
}

// attach modal open logic to each project
document.querySelectorAll(".open-modal").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const projectId = btn.getAttribute("data-project-id");
    if (!projectImages[projectId]) return;

    images = projectImages[projectId];
    updateModal(0);
    modal.classList.remove("hidden");
    disableScroll();
  });
});

// clean up modal close
modalClose.addEventListener("click", () => {
  modal.classList.add("hidden");
  enableScroll();
  resetZoom();
  resetFitToScreen();
  currentIndex = 0;
});

prevBtn.addEventListener("click", () => {
  const index = (currentIndex - 1 + images.length) % images.length;
  updateModal(index);
});

nextBtn.addEventListener("click", () => {
  const index = (currentIndex + 1) % images.length;
  updateModal(index);
});

// Zoom Logic
let zoomLevel = 1;
const zoomStep = 0.25;
const maxZoom = 3;
const minZoom = 1;

const zoomInBtn = document.querySelector(".ri-zoom-in-line");
const zoomOutBtn = document.querySelector(".ri-zoom-out-line");
const mainImageContainer = document.querySelector(".modal-main-view");

let isFitToScreen = false;
let isDragging = false;
let startX, startY;
let currentX = 0;
let currentY = 0;
let animationFrame;

function updateTransform() {
  mainImage.style.transform = `scale(${zoomLevel}) translate(${currentX}px, ${currentY}px)`;
}

// Mouse Drag
mainImage.addEventListener("mousedown", (e) => {
  if (zoomLevel <= 1 || isFitToScreen) return;
  isDragging = true;
  startX = e.clientX - currentX;
  startY = e.clientY - currentY;
  mainImage.style.cursor = "grabbing";
  e.preventDefault();
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  currentX = e.clientX - startX;
  currentY = e.clientY - startY;

  cancelAnimationFrame(animationFrame);
  animationFrame = requestAnimationFrame(updateTransform);
});

document.addEventListener("mouseup", () => {
  if (isDragging) {
    isDragging = false;
    mainImage.style.cursor = "grab";
  }
});

// Touch Drag
mainImage.addEventListener("touchstart", (e) => {
  if (zoomLevel <= 1 || isFitToScreen) return;
  isDragging = true;
  startX = e.touches[0].clientX - currentX;
  startY = e.touches[0].clientY - currentY;
});

mainImage.addEventListener("touchmove", (e) => {
  if (!isDragging) return;
  currentX = e.touches[0].clientX - startX;
  currentY = e.touches[0].clientY - startY;

  cancelAnimationFrame(animationFrame);
  animationFrame = requestAnimationFrame(updateTransform);
});

mainImage.addEventListener("touchend", () => {
  isDragging = false;
});

// Zoom Controls
function applyZoom() {
  updateTransform();
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

function resetZoom() {
  zoomLevel = 1;
  currentX = 0;
  currentY = 0;
  applyZoom();
}

// Fit to screen
fitToScreenBtn.addEventListener("click", () => {
  isFitToScreen = !isFitToScreen;

  if (isFitToScreen) {
    // Reset everything for clean fit
    resetZoom();
    mainImage.classList.add("fit-screen");
    mainImage.style.transform = "none";
  } else {
    mainImage.classList.remove("fit-screen");
    applyZoom(); // restore zoomed state
  }
});

function resetFitToScreen() {
  isFitToScreen = false;
  mainImage.classList.remove("fit-screen");
}

modalClose.addEventListener("click", resetFitToScreen);
prevBtn.addEventListener("click", resetFitToScreen);
nextBtn.addEventListener("click", resetFitToScreen);
thumbs.forEach((thumb) => {
  thumb.addEventListener("click", resetFitToScreen);
});

// keyboard controls to image modal
const imageModal = document.getElementById("imageModal");
// const modalClose = document.getElementById("modalCloseBtn");
// const prevBtn = document.getElementById("prevBtn");
// const nextBtn = document.getElementById("nextBtn");

document.addEventListener("keydown", (event) => {
  const isModalVisible = !imageModal.classList.contains("hidden");

  if (!isModalVisible) return;

  switch (event.key) {
    case "Escape":
      modalClose.click(); // simulate close
      break;
    case "ArrowLeft":
      prevBtn.click(); // go to previous image
      break;
    case "ArrowRight":
      nextBtn.click(); // go to next image
      break;
  }
});

// Disable background scroll
function disableScroll() {
  document.body.classList.add("no-scroll");
}

// Enable background scroll
function enableScroll() {
  document.body.classList.remove("no-scroll");
}

// On modal open
document.querySelectorAll(".open-modal").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const index = parseInt(btn.getAttribute("data-index"));
    updateModal(index);
    modal.classList.remove("hidden");
    disableScroll(); // Disable background scroll
  });
});

// On modal close
modalClose.addEventListener("click", () => {
  modal.classList.add("hidden");
  enableScroll(); // Enable background scroll
});
