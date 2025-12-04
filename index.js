/******************************
 * Dark Mode (with memory)
 ******************************/
const themeButton = document.getElementById("theme-button");

function applyTheme(mode) {
  document.body.classList.toggle("dark-mode", mode === "dark");

  if (themeButton) {
    themeButton.textContent = mode === "dark" ? "☀️ Day" : "🌙 Night";
  }
}

// Load saved theme on page load (default: light)
const savedTheme = localStorage.getItem("theme") || "light";
applyTheme(savedTheme);

// Toggle theme on click + remember choice
if (themeButton) {
  themeButton.addEventListener("click", () => {
    const next = document.body.classList.contains("dark-mode") ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem("theme", next);
  });
}


/******************************
 * RSVP — Form + Counter
 ******************************/
const rsvpForm    = document.getElementById("rsvp-form");
const rsvpButton  = document.getElementById("rsvp-button");
const rsvpList    = document.getElementById("rsvp-list");
const rsvpSection = document.getElementById("rsvp");

// Create / locate the counter element just under the RSVP heading
let countEl = document.getElementById("rsvp-count");
if (!countEl && rsvpSection) {
  countEl = document.createElement("p");
  countEl.id = "rsvp-count";
  const container = rsvpSection.querySelector(".rsvp-container");
  rsvpSection.insertBefore(countEl, container || rsvpSection.firstChild);
}

// Initialize count from current list items
let count = rsvpList ? rsvpList.querySelectorAll("li").length : 0;
updateCount();

function updateCount() {
  if (!countEl) return;
  const label = count === 1 ? "person has" : "people have";
  countEl.textContent = `⭐ ${count} ${label} RSVP’d to this event!`;
}

// Add a new participant to the list and update counter
function addParticipant(person) {
  if (!rsvpList) return;

  const li = document.createElement("li");

  const placeText =
    person.hometown && person.hometown.length > 0
      ? person.hometown
      : "somewhere in the world";

  const captionText =
    person.message && person.message.length > 0
      ? ` — “${person.message}”`
      : ' — “Shared their moment!”';

  li.textContent = `📸 ${person.name} from ${placeText}${captionText}`;
  rsvpList.appendChild(li);

  count += 1;
  updateCount();
}


/******************************
 * Success Modal + Animation
 ******************************/
let rotateFactor = 0;
let modalImage   = document.getElementById("modal-img");
let animationId  = null;

function animateImage() {
  if (!modalImage) return;
  // Alternate between 0° and -10° for a “waving” effect
  rotateFactor = rotateFactor === 0 ? -10 : 0;
  modalImage.style.transform = `rotate(${rotateFactor}deg)`;
}

const toggleModal = (person) => {
  const modal     = document.getElementById("success-modal");
  const modalText = document.getElementById("modal-text");

  if (!modal) return;

  // Show modal
  modal.style.display = "flex";

  if (modalText) {
    const placeText =
      person.hometown && person.hometown.length > 0
        ? person.hometown
        : "your travels";

    modalText.textContent =
      `Thanks for RSVPing, ${person.name}! We can’t wait to see your photo from ${placeText}.`;
  }

  // Start waving animation
  if (!animationId) {
    animationId = setInterval(animateImage, 300);
  }

  // Hide modal after 5 seconds
  setTimeout(() => {
    modal.style.display = "none";
    if (animationId) {
      clearInterval(animationId);
      animationId = null;
    }
  }, 5000);
};


/******************************
 * RSVP — Form Validation (using object)
 ******************************/
function validateForm(event) {
  // prevent page reload
  event.preventDefault();
  if (!rsvpForm) return;

  const nameEl    = document.getElementById("rsvp-name");
  const placeEl   = document.getElementById("rsvp-place");
  const messageEl = document.getElementById("rsvp-message");

  // Clear previous error highlighting
  [nameEl, placeEl, messageEl].forEach((el) => {
    if (el) el.classList.remove("error");
  });

  let containsErrors = false;

  const nameValue    = nameEl ? nameEl.value.trim() : "";
  const placeValue   = placeEl ? placeEl.value.trim() : "";
  const messageValue = messageEl ? messageEl.value.trim() : "";

  // Require at least 2 characters for name and location
  if (nameValue.length < 2) {
    if (nameEl) nameEl.classList.add("error");
    containsErrors = true;
  }
  if (placeValue.length < 2) {
    if (placeEl) placeEl.classList.add("error");
    containsErrors = true;
  }

  // If valid, build person object, add participant, show modal, clear form
  if (!containsErrors) {
    const person = {
      name: nameValue,
      hometown: placeValue,
      message: messageValue,
    };

    addParticipant(person);
    toggleModal(person);
    rsvpForm.reset();
  }
}

// Listen on the button per the project directions
if (rsvpButton) {
  rsvpButton.addEventListener("click", validateForm);
}
