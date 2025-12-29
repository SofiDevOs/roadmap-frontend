const tabsParent = document.querySelector(".tabs");

tabsParent?.addEventListener("click", (e) => {
  e.preventDefault;
  const target = e.target as HTMLElement;

  if (target.tagName !== "BUTTON") return;
  if (target.tagName === "BUTTON") {
    const buttons = tabsParent.querySelectorAll("button");
    buttons.forEach((btn) => btn.classList.remove("is-active"));
    target.classList.add("is-active");
  }

  resetPanels();

  const panel = document.querySelector(
    `[data-id="${target.id}"]`
  ) as HTMLElement;
  panel.hidden = false;
});
function resetPanels() {
  const panels = document.querySelectorAll(".panel") as NodeListOf<HTMLElement>;

  panels.forEach((panel) => (panel.hidden = true));
}
