from PyPDF2 import PdfReader, PdfWriter
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def clean_pdf(input_file_path, output_file_name):
    try:
        logger.info(f"Opening PDF: {input_file_path}")
        reader = PdfReader(input_file_path)
        writer = PdfWriter()
        
        remove_last_page_text = "Check out nextwork.org for more projects"
        total_pages = len(reader.pages)
        logger.info(f"Total pages in PDF: {total_pages}")

        # Iterate through pages
        for i, page in enumerate(reader.pages):
            logger.info(f"\nProcessing page {i+1}/{total_pages}")
            
            # Extract and log text for debugging
            text = page.extract_text()
            logger.debug(f"Page {i+1} text preview: {text[:200]}...")
            
            # Check last page with more flexible text matching
            if i == total_pages - 1:
                cleaned_text = ''.join(text.lower().split())
                check_text = ''.join(remove_last_page_text.lower().split())
                logger.debug(f"Checking last page for removal text. Found: {check_text in cleaned_text}")
                if check_text in cleaned_text:
                    logger.info("Skipping last page as it contains the removal text")
                    continue

            # Create a new page object
            new_page = page

            # Get and log original page dimensions
            media_box = new_page.mediabox
            original_height = float(media_box.top)
            original_width = float(media_box.right)
            header_height = original_height * 0.15  # 15% of page height
            
            logger.debug(f"Original dimensions - Height: {original_height}, Width: {original_width}")
            logger.debug(f"Calculated header height: {header_height}")

            # Set new dimensions - CORRECTED to remove top portion
            try:
                new_page.mediabox.top = original_height - header_height  # Remove top portion
                new_page.mediabox.bottom = 0  # Keep bottom intact
                new_page.mediabox.left = 0
                new_page.mediabox.right = original_width
                logger.debug(f"New page dimensions - Top: {new_page.mediabox.top}, Bottom: {new_page.mediabox.bottom}")
            except Exception as e:
                logger.error(f"Error adjusting page dimensions: {e}")

            writer.add_page(new_page)
            logger.info(f"Added modified page {i+1} to output")

        # Write the output file
        output_path = f"AWS Personal Project Docs/{output_file_name}.pdf"
        logger.info(f"Writing output to: {output_path}")
        with open(output_path, "wb") as output_file:
            writer.write(output_file)
        logger.info("PDF generation completed successfully")

    except Exception as e:
        logger.error(f"Error processing the PDF: {e}")
        raise

def analyze_pdf_structure(pdf_path):
    """Analyze the PDF structure to help identify header location"""
    try:
        logger.info(f"\nAnalyzing PDF structure: {pdf_path}")
        reader = PdfReader(pdf_path)
        page = reader.pages[0]  # Analyze first page
        
        # Log page properties
        logger.info("Page Properties:")
        logger.info(f"MediaBox: {page.mediabox}")
        logger.info(f"CropBox: {page.cropbox if hasattr(page, 'cropbox') else 'Not set'}")
        logger.info(f"BleedBox: {page.bleedbox if hasattr(page, 'bleedbox') else 'Not set'}")
        logger.info(f"TrimBox: {page.trimbox if hasattr(page, 'trimbox') else 'Not set'}")
        logger.info(f"ArtBox: {page.artbox if hasattr(page, 'artbox') else 'Not set'}")
        
        # Try to extract resources
        if page.get("/Resources"):
            logger.info("\nPage Resources:")
            resources = page["/Resources"]
            logger.info(f"Resource keys: {list(resources.keys())}")
    except Exception as e:
        logger.error(f"Error analyzing PDF: {e}")

if __name__ == "__main__":
    input_path = input("Enter the absolute file path of the PDF: ")
    output_name = input("Enter the name for the new PDF file (without extension): ")
    
    # First analyze the PDF structure
    analyze_pdf_structure(input_path)
    
    # Then try to clean it
    clean_pdf(input_path, output_name)
