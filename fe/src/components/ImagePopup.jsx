import { useState, useEffect } from "react";

export async function getImageUrl(image) {
    console.log('Fetching image:', image);
    image = image.trim();
    return await fetch(`http://127.0.0.1:5000/image/${image}`, {
        method: 'GET',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        // .then(data => console.log('Image URL:', data.image))
        .catch(error => console.error('Error:', error));
}