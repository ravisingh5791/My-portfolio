const roles = [
  "Full Stack Developer",
  "React and Node.js Builder",
  "Java and SQL Problem Solver",
];

const typedText = document.getElementById("typed-text");
const profileUpload = document.getElementById("profile-upload");
const profilePreview = document.getElementById("profile-preview");
const photoPlaceholder = document.getElementById("photo-placeholder");
const uploadHelp = document.getElementById("upload-help");

const STORAGE_KEY = "ravi-portfolio-profile-photo";

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let savedPhotoWasTried = false;

function typeRole() {
  const currentRole = roles[roleIndex];
  const nextValue = isDeleting
    ? currentRole.slice(0, charIndex--)
    : currentRole.slice(0, charIndex++);

  typedText.textContent = nextValue;

  let delay = isDeleting ? 45 : 85;

  if (!isDeleting && nextValue === currentRole) {
    delay = 1400;
    isDeleting = true;
  } else if (isDeleting && nextValue === "") {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    charIndex = 0;
    delay = 280;
  }

  window.setTimeout(typeRole, delay);
}

typeRole();

function showProfilePhoto(src) {
  if (!profilePreview || !photoPlaceholder) return;

  profilePreview.hidden = false;
  profilePreview.src = src;
  photoPlaceholder.classList.add("has-image");
}

function showUploadMessage(message) {
  if (uploadHelp) {
    uploadHelp.textContent = message;
  }
}

function loadSavedPhoto() {
  const savedPhoto = window.localStorage.getItem(STORAGE_KEY);

  if (!savedPhoto || savedPhotoWasTried) return;

  savedPhotoWasTried = true;
  showProfilePhoto(savedPhoto);
  showUploadMessage("Your saved profile picture is showing.");
}

function showExistingProfilePhoto() {
  if (!profilePreview || !photoPlaceholder) return;

  if (profilePreview.complete && profilePreview.naturalWidth > 0) {
    photoPlaceholder.classList.add("has-image");
    showUploadMessage("Your profile picture is showing.");
  }
}

if (profilePreview) {
  profilePreview.addEventListener("load", () => {
    photoPlaceholder?.classList.add("has-image");
    showUploadMessage("Your profile picture is showing.");
  });

  profilePreview.addEventListener("error", () => {
    photoPlaceholder?.classList.remove("has-image");
    profilePreview.removeAttribute("src");
    loadSavedPhoto();
  });
}

if (profileUpload) {
  profileUpload.addEventListener("change", (event) => {
    const [file] = event.target.files || [];
    if (!file) return;

    const reader = new FileReader();

    reader.addEventListener("load", () => {
      const imageData = reader.result;
      showProfilePhoto(imageData);

      try {
        window.localStorage.setItem(STORAGE_KEY, imageData);
        showUploadMessage("Profile picture saved in this browser.");
      } catch (error) {
        showUploadMessage("Profile picture is showing, but it was too large to save.");
      }
    });

    reader.readAsDataURL(file);
  });
}

loadSavedPhoto();
showExistingProfilePhoto();
