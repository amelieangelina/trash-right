import os
from dotenv import load_dotenv
from pathlib import Path
from PIL import Image
import google.generativeai as genai



# Load environment variables
env_path = Path(__file__).parents[1].joinpath("secret","api_key.env")
load_dotenv(env_path)

genai.configure(api_key=os.environ.get("API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash')



# response = model.generate_content("What do you know about the trash system in Europe?")
# print(response.text)
# print(response)

def detect_trash():
    img = Image.open("2024-07-30-102827.jpg")
    response = model.generate_content(["What kind of trash is displayed in the picture. What material is it? ", img], stream=True)
    response.resolve()
    return response

if __name__ == '__main__':
    response = detect_trash()
    print(response)
    print(response.text)
