interface HTMLFileUploadFormElement extends HTMLFormElement {
  dataset: {
    dir: string;
    apiUrl: string;
  };

}



import ToastNotification from "@utils/toastAlerts.controller";


export const uploadImage = (fileInput: HTMLInputElement, fileUploadForm: HTMLFileUploadFormElement, fileUploadDialog: HTMLDialogElement, imageContainer: HTMLElement) => {


  fileInput?.addEventListener("change", async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      (imageContainer.querySelector("img") as HTMLImageElement).src =
        URL.createObjectURL(file);
    }
    const formData = new FormData(fileUploadForm);
    formData.append("filename", `${fileUploadForm.dataset.dir}/${file?.name}`);
    try {
      const response = await fetch(fileUploadForm.dataset.apiUrl as string, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) throw new Error("File upload failed");

      ToastNotification("File uploaded successfully", "success");
      fileUploadDialog.close();
    } catch (error: Error | any) {
      if (error.message === "File upload failed") {
        ToastNotification("File upload failed", "error");
      }
      ToastNotification("An error occurred", "error");
      return;
    }
  });

  imageContainer.addEventListener("click", () => {
    fileUploadDialog.showModal();
  });
};
