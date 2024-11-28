import os
import fitz
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def compress_pdf(input_path, output_path):
    """
    Compress PDF file using PyMuPDF.
    """
    try:
        # Open the PDF
        pdf_document = fitz.open(input_path)
        
        # Ensure output directory exists
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        # Set compression parameters
        pdf_document.save(
            output_path,
            garbage=4,  # Maximum garbage collection
            clean=True,
            deflate=True,
            linear=True,
            pretty=False
        )
        
        # Close the document
        pdf_document.close()
            
        # Log compression results
        original_size = os.path.getsize(input_path) / 1024  # KB
        compressed_size = os.path.getsize(output_path) / 1024  # KB
        reduction = ((original_size - compressed_size) / original_size) * 100
        
        logger.info(f"Reduction: {reduction:.2f}%")
        
        return True
    except Exception as e:
        logger.error(f"Error compressing {input_path}: {e}")
        return False

def process_folder():
    """
    Process all PDFs in the original folder and create compressed versions.
    """
    # Define paths
    original_folder = "AWS Personal Project Docs"
    compressed_folder = "AWS Docs Compressed"
    
    # Create compressed folder if it doesn't exist
    os.makedirs(compressed_folder, exist_ok=True)
    
    # Get all PDF files
    pdf_files = [f for f in os.listdir(original_folder) if f.endswith('.pdf')]
    
    success_count = 0
    total_original_size = 0
    total_compressed_size = 0
    
    for pdf_file in pdf_files:
        input_path = os.path.join(original_folder, pdf_file)
        output_path = os.path.join(compressed_folder, pdf_file)
        
        if compress_pdf(input_path, output_path):
            success_count += 1
            total_original_size += os.path.getsize(input_path)
            total_compressed_size += os.path.getsize(output_path)
    
    # Log overall compression results
    if success_count > 0:
        total_reduction = ((total_original_size - total_compressed_size) / total_original_size) * 100
        logger.info("\nOverall Compression Results:")
        logger.info(f"Total original size: {total_original_size/1024/1024:.2f}MB")
        logger.info(f"Total compressed size: {total_compressed_size/1024/1024:.2f}MB")
        logger.info(f"Total reduction: {total_reduction:.2f}%")
    
    logger.info(f"\nSuccessfully compressed {success_count} out of {len(pdf_files)} files")

if __name__ == "__main__":
    process_folder() 