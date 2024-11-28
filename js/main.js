document.addEventListener("DOMContentLoaded", function () {
  // Only run on documentation page
  if (window.location.pathname.includes("documentation.html")) {
    loadDocumentations();
  }
});

// Get the base path for GitHub Pages
function getBasePath() {
  return "/AWSPracticeAndKnowledgeBase";
}

// Predefined colors for sections
const SECTION_COLORS = [
  "#4285f4", // Google Blue
  "#ea4335", // Google Red
  "#34a853", // Google Green
  "#fbbc05", // Google Yellow
  "#9c27b0", // Purple
  "#00acc1", // Cyan
  "#ff5722", // Deep Orange
  "#3f51b5", // Indigo
  "#4caf50", // Green
  "#ff4081", // Pink
];

async function getSectionColor(index) {
  return SECTION_COLORS[index % SECTION_COLORS.length];
}

async function loadDocumentations() {
  const docsContainer = document.querySelector(".docs-container");
  const basePath = getBasePath();

  try {
    // Get the list of directories in assets/docs
    const response = await fetch(`${basePath}/assets/docs/`);
    const text = await response.text();

    // Create a temporary element to parse the HTML response
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");

    // Get all folder links (they end with /)
    const folders = Array.from(doc.querySelectorAll("a"))
      .filter((a) => a.href.endsWith("/"))
      .map((a) => a.textContent.replace("/", ""))
      .filter((name) => name !== ".." && name !== "."); // Remove parent directory links

    // Create sections from folders
    const sections = await Promise.all(
      folders.map(async (folderName, index) => {
        // Get list of PDFs in the folder
        const folderResponse = await fetch(
          `${basePath}/assets/docs/${folderName}/`
        );
        const folderText = await folderResponse.text();
        const folderDoc = parser.parseFromString(folderText, "text/html");

        const pdfs = Array.from(folderDoc.querySelectorAll("a"))
          .filter((a) => a.href.toLowerCase().endsWith(".pdf"))
          .map((a) => a.textContent);

        return {
          name: folderName,
          color: await getSectionColor(index),
          pdfs: pdfs,
        };
      })
    );

    // Create and append section cards
    sections.forEach((section) => {
      const sectionCard = createSectionCard(section);
      docsContainer.appendChild(sectionCard);
    });
  } catch (error) {
    console.error("Error loading documentations:", error);
    docsContainer.innerHTML = `
      <div class="error-message">
        <p>Error loading documentation. Please try again later.</p>
        <p class="error-details">${error.message}</p>
      </div>
    `;
  }
}

function createSectionCard(section) {
  const card = document.createElement("div");
  card.className = "section-card";
  const basePath = getBasePath();

  // Create header with section name
  const header = document.createElement("div");
  header.className = "section-header collapsed";

  const title = document.createElement("h2");
  title.textContent = section.name;
  title.style.color = section.color;

  const toggleIcon = document.createElement("i");
  toggleIcon.className = "fas fa-chevron-down toggle-icon";
  toggleIcon.style.color = section.color;

  header.appendChild(title);
  header.appendChild(toggleIcon);

  const pdfList = document.createElement("ul");
  pdfList.className = "pdf-list";

  if (section.pdfs && section.pdfs.length > 0) {
    section.pdfs.forEach((pdf) => {
      const li = document.createElement("li");
      const link = document.createElement("a");
      link.href = `${basePath}/assets/docs/${section.name}/${pdf}`;
      link.target = "_blank";
      link.innerHTML = `<i class="fas fa-file-pdf" style="color: ${section.color}"></i> ${pdf}`;
      li.appendChild(link);
      pdfList.appendChild(li);
    });
  } else {
    const li = document.createElement("li");
    li.className = "empty-section";
    li.innerHTML = `<p><i class="fas fa-info-circle" style="color: ${section.color}"></i> Coming soon! This section will be updated with new content.</p>`;
    pdfList.appendChild(li);
  }

  // Add click handler for dropdown
  header.addEventListener("click", () => {
    header.classList.toggle("collapsed");
    pdfList.classList.toggle("expanded");
  });

  card.appendChild(header);
  card.appendChild(pdfList);
  return card;
}
