export function displayImages(
  files: FileList | File[],
  container: HTMLElement,
) {
  for (const file of files) {
    if (!file.type.startsWith("image/")) continue;

    const li = document.createElement("li"),
      content = document.createElement("div"),
      img = document.createElement("img"),
      button = document.createElement("button"),
      icon = document.createElement("iconify-icon");

    icon.setAttribute("icon", "ic:round-upload");
    icon.setAttribute("width", "26");
    icon.setAttribute("height", "26");
    button.appendChild(icon);

    img.src = URL.createObjectURL(file);
    img.alt = file.name;
    content.appendChild(img);
    content.appendChild(button);
    li.appendChild(content);
    container.appendChild(li);
  }
}
