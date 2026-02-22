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

// Button nur nutzen, wenn er existiert
if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
}