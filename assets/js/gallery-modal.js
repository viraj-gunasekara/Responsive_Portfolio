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

// Fit-to-Screen Toggle Logic
const fitToScreenBtn = document.getElementById("fitToScreenBtn");

let isFitToScreen = false;

fitToScreenBtn.addEventListener("click", () => {
  isFitToScreen = !isFitToScreen;

  if (isFitToScreen) {
    mainImage.classList.add("fit-screen");
    mainImage.style.transform = "none";
  } else {
    mainImage.classList.remove("fit-screen");
    applyZoom(); // restore previous zoom
  }
});

// Also reset fit-to-screen when navigating or closing
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
