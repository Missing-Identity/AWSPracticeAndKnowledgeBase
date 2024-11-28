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
    // Create sections manually based on the directory structure
    const sections = [
      {
        name: "AWS Cloud",
        color: SECTION_COLORS[0],
        pdfs: [
          "AWS Data Analytics and Visualization using QuickSight.pdf",
          "AWS IAM Groups and EC2 instance basics.pdf",
          "Building a Basic Chatbot with Amazon Lex - Part-1.pdf",
          "Building a Basic Chatbot with Amazon Lex - Part-2.pdf",
          "Building a Basic Chatbot with Amazon Lex - Part-3.pdf",
          "Hosting a Static Website on AWS S3.pdf",
          "Netflix Analysis Dashboard.pdf",
        ],
      },
    ];

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
      // Use encodeURIComponent to handle spaces and special characters in the path
      const encodedPath = `${basePath}/assets/docs/${encodeURIComponent(
        section.name
      )}/${encodeURIComponent(pdf)}`;
      link.href = encodedPath;
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
