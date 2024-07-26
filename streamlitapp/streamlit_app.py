import streamlit as st
from PIL import Image, ImageOps

def main():
    st.title("Waste Right")

    if 'photo_taken' not in st.session_state:
        st.session_state['photo_taken'] = False

    if not st.session_state['photo_taken']:
        if st.button('Take a Picture'):
            st.session_state['photo_taken'] = True

    if st.session_state['photo_taken']:
        img_file_buffer = st.camera_input("Capture a picture")

        if img_file_buffer is not None:
            img = Image.open(img_file_buffer)

            # Display the captured image
            st.image(img, caption='Captured Image', use_column_width=True)

            # Apply a function to the image
            processed_img = process_image(img)

            # Display the processed image
            st.image(processed_img, caption='Processed Image', use_column_width=True)

            if st.button('Reset'):
                st.session_state['photo_taken'] = False


def process_image(image):
    # Example function that converts image to grayscale
    grayscale_image = ImageOps.grayscale(image)
    return grayscale_image

if __name__ == "__main__":
    main()

