import ToastNotification from "@utils/toastAlerts.controller";
import { delay, $ } from "./utils";
import { uploadFile } from "./upload";
import { displayImages } from "./display";

const fileUploadForm = $("#file-upload-form") as HTMLFormElement;
const dropZone = $("#drop-zone") as HTMLElement;
const preview = $("#preview") as HTMLUListElement;
const clearBtn = $("#clear-btn") as HTMLButtonElement;
const fileInput = $("#file-input") as HTMLInputElement;

const inMemoryFiles: File[] = [];

preview.addEventListener("click", handleUpload);
fileInput.addEventListener("change", handleFileInputChange);
dropZone.addEventListener("drop", dropHandler);
clearBtn.addEventListener("click", handleCleanup);

async function dropHandler(ev: DragEvent) {
  ev.preventDefault();
  const files = [...(ev.dataTransfer?.items || [])]
    .map(({ getAsFile }) => getAsFile())
    .filter((file) => file) as File[] | FileList;

  displayImages(files, preview);
  
  for (const file of files) {
    inMemoryFiles.push(file);
  }
}

function handleFileInputChange(e: Event) {
  const target = e.target as HTMLInputElement;
  if (!target.files) return;

  displayImages(target.files, preview);

  for (const file of target.files) {
    inMemoryFiles.push(file);
  }
}

function handleCleanup() {
  for (const img of preview.querySelectorAll("img")) {
    URL.revokeObjectURL(img.src);
  }
  preview.textContent = "";
  inMemoryFiles.length = 0;
  console.log("Cleared in-memory files:", inMemoryFiles);
}

async function handleUpload( e: MouseEvent) {
  const target = e.target as HTMLElement;
  if (target.tagName.toLowerCase() !== "button") return;

  const icon = target.querySelector("iconify-icon");
  icon?.setAttribute("icon", "line-md:loading-loop");

  try {
    const li = target.closest("li");
    const img = li?.querySelector("img");
    const fileName = img?.alt;
    const file = inMemoryFiles.find((f) => f.name === fileName);

    if (!file) return

    await delay(500);
    await uploadFile(file, fileUploadForm);

    icon?.setAttribute("icon", "qlementine-icons:success-12");
    icon?.setAttribute("style", "color: lightgreen;");

    ToastNotification("File uploaded successfully", "success");
    (target as HTMLButtonElement).disabled = true;
    removeFileFromMemory(fileName!);

  } catch (error) {
    icon?.setAttribute("icon", "ic:twotone-error");
    icon?.setAttribute("style", "color: tomato;");

    ToastNotification("Error uploading file", "error");
  }
}

function removeFileFromMemory(fileName: string) {
  const fileIndex = inMemoryFiles.findIndex(({ name }) => name === fileName);
  if (fileIndex === -1) return;
  
  inMemoryFiles.splice(fileIndex, 1);
}

window.addEventListener("drop", (e) => {
  if ([...(e.dataTransfer?.items || [])].some(({ kind }) => kind === "file")) {
    e.preventDefault();
  }
});

dropZone.addEventListener("dragover", (e) => {
  const fileItems = [...(e.dataTransfer?.items || [])].filter(
    ({ kind }) => kind === "file",
  );

  if (fileItems.length < 0 || !e.dataTransfer) return;
  e.preventDefault();

  fileItems.some(({ type }) => type.startsWith("image/"))
    ? (e.dataTransfer.dropEffect = "copy")
    : (e.dataTransfer.dropEffect = "none");
});

window.addEventListener("dragover", (e) => {
  const fileItems = [...(e.dataTransfer?.items || [])].filter(
    ({ kind }) => kind === "file",
  );
  if (fileItems.length < 0 || !e.dataTransfer) return;
  e.preventDefault();

  if (dropZone.contains(e.target as Node)) return;
  e.dataTransfer.dropEffect = "none";
});


