const themeBtn = document.getElementById("themeBtn");
const yearSpan = document.getElementById("year");

// Jahr setzen (falls vorhanden)
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// Theme aus LocalStorage laden
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark");
}

// Theme-Button
if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
}

/* =========================
   Account-Formular Logik
========================= */
const accountForm = document.getElementById("accountForm");
const nameInput = document.getElementById("nameInput");
const addressInput = document.getElementById("addressInput");
const emailInput = document.getElementById("emailInput");
const formMessage = document.getElementById("formMessage");

// Profilbild-Elemente (nur auf account.html vorhanden)
const profileImageInput = document.getElementById("profileImageInput");
const profilePreview = document.getElementById("profilePreview");
const profilePlaceholder = document.getElementById("profilePlaceholder");

// Hier merken wir uns das aktuell gewählte Bild (Base64 Data URL)
// null = kein Bild ausgewählt
let selectedProfileImageDataUrl = null;

// Meldung als Text anzeigen
function showMessage(text, type) {
  if (!formMessage) return;

  formMessage.hidden = false;
  formMessage.classList.remove("error", "success");
  formMessage.classList.add(type);
  formMessage.innerHTML = "";
  formMessage.textContent = text;
}

// Mehrere Fehler anzeigen (Liste)
function showErrorList(errors) {
  if (!formMessage) return;

  formMessage.hidden = false;
  formMessage.classList.remove("success");
  formMessage.classList.add("error");
  formMessage.innerHTML = "";

  const ul = document.createElement("ul");
  for (const err of errors) {
    const li = document.createElement("li");
    li.textContent = err;
    ul.appendChild(li);
  }

  formMessage.appendChild(ul);
}

// Meldung ausblenden
function clearMessage() {
  if (!formMessage) return;

  formMessage.hidden = true;
  formMessage.classList.remove("error", "success");
  formMessage.innerHTML = "";
}

// Fehler-Markierung zurücksetzen
function clearInputErrors() {
  [nameInput, addressInput, emailInput].forEach((el) => {
    if (el) el.classList.remove("input-error");
  });
}

// E-Mail-Validierung
function isValidEmail(value) {
  if (typeof value !== "string") return false;

  const trimmed = value.trim();
  if (trimmed.length === 0) return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(trimmed);
}

// Text-Validierung für Name/Adresse
function isValidText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

// Profilbild-Vorschau setzen/entfernen
function updateProfilePreview(dataUrl) {
  if (!profilePreview || !profilePlaceholder) return;

  if (typeof dataUrl === "string" && dataUrl.length > 0) {
    profilePreview.src = dataUrl;
    profilePreview.hidden = false;
    profilePlaceholder.hidden = true;
  } else {
    profilePreview.src = "";
    profilePreview.hidden = true;
    profilePlaceholder.hidden = false;
  }
}

// Gespeicherte Daten laden
function loadAccountData() {
  if (!nameInput || !addressInput || !emailInput) return;

  const raw = localStorage.getItem("accountData");
  if (!raw) {
    updateProfilePreview(null);
    return;
  }

  try {
    const data = JSON.parse(raw);

    nameInput.value = typeof data.name === "string" ? data.name : "";
    addressInput.value = typeof data.address === "string" ? data.address : "";
    emailInput.value = typeof data.email === "string" ? data.email : "";

    if (typeof data.profileImage === "string" && data.profileImage.length > 0) {
      selectedProfileImageDataUrl = data.profileImage;
      updateProfilePreview(selectedProfileImageDataUrl);
    } else {
      selectedProfileImageDataUrl = null;
      updateProfilePreview(null);
    }
  } catch (error) {
    console.error("Gespeicherte Account-Daten konnten nicht geladen werden:", error);
    selectedProfileImageDataUrl = null;
    updateProfilePreview(null);
  }
}

// Profilbild-Datei einlesen
function handleProfileImageSelection(file) {
  // Kein File = optional, also kein Fehler
  if (!file) {
    return;
  }

  // Nur Bilder erlauben
  if (!file.type || !file.type.startsWith("image/")) {
    showErrorList(["Profilbild muss eine Bilddatei sein (z. B. JPG oder PNG)."]);
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    const result = reader.result;

    if (typeof result === "string") {
      selectedProfileImageDataUrl = result;
      updateProfilePreview(selectedProfileImageDataUrl);
      clearMessage();
    } else {
      showErrorList(["Profilbild konnte nicht gelesen werden."]);
    }
  };

  reader.onerror = () => {
    showErrorList(["Fehler beim Laden des Profilbilds."]);
  };

  reader.readAsDataURL(file);
}

// Nur auf account.html aktivieren
if (accountForm) {
  loadAccountData();

  // Eingaben beobachten: Fehler-Markierung/Meldung entfernen
  [nameInput, addressInput, emailInput].forEach((el) => {
    if (!el) return;

    el.addEventListener("input", () => {
      el.classList.remove("input-error");
      clearMessage();
    });
  });

  // Profilbild-Auswahl beobachten
  if (profileImageInput) {
    profileImageInput.addEventListener("change", () => {
      const file = profileImageInput.files && profileImageInput.files[0]
        ? profileImageInput.files[0]
        : null;

      handleProfileImageSelection(file);
    });
  }

  accountForm.addEventListener("submit", (event) => {
    event.preventDefault();

    clearInputErrors();
    clearMessage();

    const nameValue = nameInput.value;
    const addressValue = addressInput.value;
    const emailValue = emailInput.value;

    const errors = [];

    // Name prüfen
    if (!isValidText(nameValue)) {
      errors.push("Name muss ein nicht-leerer String sein.");
      nameInput.classList.add("input-error");
    }

    // Adresse prüfen
    if (!isValidText(addressValue)) {
      errors.push("Adresse muss ein nicht-leerer String sein.");
      addressInput.classList.add("input-error");
    }

    // E-Mail prüfen
    if (!isValidEmail(emailValue)) {
      errors.push("E-Mail muss ein gültiger String sein (z. B. max@example.com).");
      emailInput.classList.add("input-error");
    }

    // Profilbild ist optional -> KEIN Fehler, wenn leer
    // selectedProfileImageDataUrl darf also null sein

    if (errors.length > 0) {
      showErrorList(errors);
      return;
    }

    // Speichern
    const accountData = {
      name: nameValue.trim(),
      address: addressValue.trim(),
      email: emailValue.trim(),
      profileImage: selectedProfileImageDataUrl, // kann null sein
    };

    localStorage.setItem("accountData", JSON.stringify(accountData));

    showMessage("Daten erfolgreich gespeichert.", "success");
  });
}