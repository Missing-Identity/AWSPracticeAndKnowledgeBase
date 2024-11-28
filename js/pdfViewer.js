function openPdfViewer(pdfPath, pdfName) {
  const modal = document.getElementById("pdfModal");
  const pdfViewer = document.getElementById("pdfViewer");
  const downloadBtn = document.getElementById("downloadBtn");

  pdfViewer.src = pdfPath;
  downloadBtn.href = pdfPath;
  downloadBtn.download = pdfName;
  modal.style.display = "block";

  // Close modal when clicking the close button
  document.querySelector(".close").onclick = function () {
    modal.style.display = "none";
    pdfViewer.src = "";
  };

  // Close modal when clicking outside
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
      pdfViewer.src = "";
    }
  };

  // Handle escape key
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && modal.style.display === "block") {
      modal.style.display = "none";
      pdfViewer.src = "";
    }
  });
}
