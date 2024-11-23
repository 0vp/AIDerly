import random
import requests as req
from bs4 import BeautifulSoup

def get_image(item):
    url = f"https://images.search.yahoo.com/search/images?p={item}"
    
    response = req.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    images = soup.find_all('img')

    image_urls = [img['src'] for img in images if 'src' in img.attrs]
    image_urls = [url for url in image_urls if '--~' not in url]

    # return random.choice(image_urls)
    return image_urls[0]

# print(get_image('ryushen tan'))