import sys
import subprocess

def check_pymupdf():
    try:
        # Try different import methods
        methods = [
            "import fitz",
            "import PyMuPDF as fitz", 
            "import pymupdf as fitz"
        ]
        
        for method in methods:
            result = subprocess.run([sys.executable, '-c', method], 
                                    capture_output=True, 
                                    text=True)
            print(f"Method '{method}' result:", 
                  "Success" if result.returncode == 0 else "Failed")
            if result.returncode != 0:
                print("Error:", result.stderr)
        
        # Check installed packages
        result = subprocess.run([sys.executable, '-m', 'pip', 'list'], 
                                capture_output=True, 
                                text=True)
        print("\nInstalled Packages:\n", result.stdout)
    
    except Exception as e:
        print(f"An error occurred: {e}")

check_pymupdf()