type ToastType = "info" | "success" | "error" | "warning";
const toastBox = document.querySelector(".toast-alerts");
export default function ToastNotification(msg:string, type: ToastType = "info") {
  if (!toastBox) {
    console.error("Toast container not found.");
    return;
  }
  const toast = document.createElement("div");
  toast.classList.add("toast-message", type);
  toast.innerHTML = msg;

  // Append the toast to the toastBox
  toastBox.appendChild(toast);
  toastBox.classList.add("show");

  // Eliminar el toast después de 5 segundos
  setTimeout(() => toast.remove(), 5000);
}
