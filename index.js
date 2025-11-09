/******************************
 * Dark Mode
 ******************************/
let themeButton = document.getElementById("theme-button");

const toggleDarkMode = () => {
  document.body.classList.toggle("dark-mode");
};

themeButton.addEventListener("click", toggleDarkMode);


/******************************
 * RSVP — Form Handling
 ******************************/
const rsvpForm   = document.getElementById("rsvp-form");
const rsvpButton = document.getElementById("rsvp-button");   // submit button
const rsvpList   = document.getElementById("rsvp-list");
const rsvpSection = document.getElementById("rsvp");

// Create / locate the counter element just under the RSVP heading
let countEl = document.getElementById("rsvp-count");
if (!countEl) {
  countEl = document.createElement("p");
  countEl.id = "rsvp-count";
  const container = rsvpSection.querySelector(".rsvp-container");
  rsvpSection.insertBefore(countEl, container || rsvpSection.firstChild);
}

// Initialize count from current list items
let count = rsvpList ? rsvpList.querySelectorAll("li").length : 0;
updateCount();

function updateCount() {
  const label = count === 1 ? "person has" : "people have";
  countEl.textContent = `⭐ ${count} ${label} RSVP’d to this event!`;
}

// Responsible only for adding to the list + updating count
function addParticipant(name, place, message) {
  const li = document.createElement("li");
  li.textContent = `📸 ${name} from ${place} — “${message || "Shared their moment!"}”`;
  rsvpList.appendChild(li);

  count += 1;
  updateCount();
}


/******************************
 * RSVP — Form Validation
 ******************************/
function validateForm(event) {
  // we’re listening on the button, so prevent form submit page reload
  event.preventDefault();

  const nameEl    = document.getElementById("rsvp-name");
  const placeEl   = document.getElementById("rsvp-place");
  const messageEl = document.getElementById("rsvp-message");

  // Clear any previous error styling
  [nameEl, placeEl, messageEl].forEach(el => el.classList.remove("error"));

  let containsErrors = false;

  // Require name + place
  if (nameEl.value.trim() === "") {
    nameEl.classList.add("error");
    containsErrors = true;
  }
  if (placeEl.value.trim() === "") {
    placeEl.classList.add("error");
    containsErrors = true;
  }

  // If no errors, add participant and clear fields
  if (!containsErrors) {
    addParticipant(
      nameEl.value.trim(),
      placeEl.value.trim(),
      messageEl.value.trim()
    );

    // Clear all fields
    rsvpForm.reset();
  }
}

// Listen on the button per the project directions
rsvpButton.addEventListener("click", validateForm);
