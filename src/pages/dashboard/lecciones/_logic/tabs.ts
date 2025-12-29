const tabsParent = document.querySelector(".tabs");

tabsParent?.addEventListener("click", (e) => {
  e.preventDefault;
  const target = e.target as HTMLElement;

  if (target.tagName !== "BUTTON") return;

  resetPanels();

  const panel = document.querySelector(
    `[data-id="${target.id}"]`
  ) as HTMLElement;

  panel.hidden = false;
});
function resetPanels() {
  const panels = document.querySelectorAll(".panel") as NodeListOf<HTMLElement>;

  panels.forEach((panel) => panel.hidden = true );
};
