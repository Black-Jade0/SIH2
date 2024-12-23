# -*- coding: utf-8 -*-
"""Exam_evaluation_using_ocr.ipynb

Automatically generated by Colab.

Original file is located at
    https://colab.research.google.com/github/Black-Jade0/AI-Models/blob/master/Exam_evaluation_using_ocr.ipynb
"""
import pymupdf as fitz
import keras_ocr
import matplotlib.pyplot as plt

# Initialize the OCR pipeline
pipeline = keras_ocr.pipeline.Pipeline()

# Open the PDF
doc = fitz.open('/content/imagtopdf.pdf')

# List to store all images from all pages
all_images = []

# Iterate through all pages to extract images
for page in doc:
    images = page.get_images()
    if images:  # Check if there are images on this page
        # Collect image paths for the current page
        for img in images:
            xref = img[0]
            pix = fitz.Pixmap(doc, xref)
            if pix.n - pix.alpha < 4:       # this is GRAY or RGB
                pix.save("page%s-%s.png" % (page.number, xref))
            else:               # CMYK: convert to RGB first
                pix1 = fitz.Pixmap(fitz.csRGB, pix)
                pix1.save("page%s-%s.png" % (page.number, xref))
                pix1 = None
            pix = None

        page_images = ["page%s-%s.png" % (page.number, img[0]) for img in images]
        all_images.extend(page_images)  # Add to the all_images list

        page_images = ["page%s-%s.png" % (page.number, img[0]) for img in images]
        all_images.extend(page_images)  # Add to the all_images list

# Process all collected images
if all_images:  # Check if images list is not empty
    # Load images based on their paths
    loaded_images = [keras_ocr.tools.read(image_path) for image_path in all_images]
    prediction_groups = pipeline.recognize(loaded_images)

    # Create subplots based on the number of images
    fig, axs = plt.subplots(nrows=len(loaded_images) if len(loaded_images) > 1 else 1, figsize=(10, 20))
    if len(loaded_images) == 1:
        axs = [axs]  # Make axs a list for the single image case

    # Draw annotations on the images
    for ax, image, predictions in zip(axs, loaded_images, prediction_groups):
        keras_ocr.tools.drawAnnotations(image=image, predictions=predictions, ax=ax)

    plt.show()

for predictions in prediction_groups:
    for box, text in predictions:
        print(text)  # This will p

from spellchecker import SpellChecker
spell = SpellChecker()

# def correct_text(text):
#     words = text.split()
#     # Get unique words to minimize processing time
#     unique_words = set(words)

#     # Correct all unique words
#     corrected_words = {word: spell.correction(word) for word in unique_words}

#     # Replace words in the original text
#     corrected_text = ' '.join(corrected_words.get(word, word) for word in words)
#     return corrected_text

# # Assuming prediction_groups from previous cell
ocr_output_text = []

# Collect OCR output text
for predictions in prediction_groups:
    for box, text in predictions:
        ocr_output_text.append(str(text))

# Join the OCR outputs into a single string
ocr_output_text = ' '.join(ocr_output_text)

# Correct the extracted text
# corrected_answer = correct_text(ocr_output_text)
print(ocr_output_text)

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

import nltk
from nltk import word_tokenize

# Example of generating text using basic NLP
sentence = "insert node at any position in the linked lists"

keywords = ["Node", "linked ","list", "vector","head","next"]

nltk.download('punkt')
# Tokenizing the sentence
tokens = word_tokenize(sentence)


# Filtering sentence based on keywords
generated_sentence = " ".join([word for word in tokens if word in keywords])

print(generated_sentence)

from sentence_transformers import SentenceTransformer, util

reference_ans = generated_sentence
student_ans = str(ocr_output_text)


model = SentenceTransformer('all-mpnet-base-v2')

embeddings = model.encode([reference_ans, student_ans])

# Calculate cosine similarity between the embeddings
similarity = util.pytorch_cos_sim(embeddings[0], embeddings[1])
print(f'Semantic Similarity: {similarity.item() * 100:.2f}%')

def grade_answer(similarity_score):
    if similarity_score > 0.9:
        return 10  # Full marks
    elif similarity_score > 0.75:
        return 8  # Partial marks
    elif similarity_score > 0.5:
        return 5  # Minimal marks
    elif similarity_score > 0.25:
        return 3  # Minimal marks
    elif similarity_score > 0.1:
        return 2  # Minimal marks
    else:
        return 0  # No marks

score = grade_answer(similarity.item())
print(f'Student Score: {score}')