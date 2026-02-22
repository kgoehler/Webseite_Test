const themeBtn = document.getElementById("themeBtn");
const yearSpan = document.getElementById("year");

// Jahr setzen
yearSpan.textContent = new Date().getFullYear();

// Dark Mode: Zustand merken
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark");
}

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
});