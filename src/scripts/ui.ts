function toggleDrawer() {
  const drawer = document.getElementById("side-drawer");
  const overlay = document.getElementById("drawer-overlay");
  if (!drawer || !overlay) return;

  if (drawer.classList.contains("-translate-x-full")) {
    drawer.classList.remove("-translate-x-full");
    overlay.classList.remove("hidden");
    setTimeout(() => {
      overlay.classList.add("opacity-100");
    }, 10);
  } else {
    drawer.classList.add("-translate-x-full");
    overlay.classList.remove("opacity-100");
    setTimeout(() => {
      overlay.classList.add("hidden");
    }, 300);
  }
}

document.getElementById("drawer-open")?.addEventListener("click", toggleDrawer);
document.getElementById("drawer-close")?.addEventListener("click", toggleDrawer);
document.getElementById("drawer-overlay")?.addEventListener("click", toggleDrawer);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-fade-in-up");
        (entry.target as HTMLElement).style.opacity = "1";
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll(".product-card, .flex-col.items-center").forEach((el) => {
  (el as HTMLElement).style.opacity = "0";
  observer.observe(el);
});
