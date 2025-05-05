document.addEventListener('DOMContentLoaded', () => {
    // Load dog images and breeds when the page loads
    loadDogCarousel();
    loadDogBreeds();
});

// oad random dog images into the carousel
function loadDogCarousel() {
    fetch('https://dog.ceo/api/breeds/image/random/10')
        .then(res => res.json())
        .then(data => {
            const carousel = document.getElementById('dogCarousel');
            data.message.forEach(url => {
                const img = document.createElement('img');
                img.src = url;
                carousel.appendChild(img);
            });
            new SimpleSlider('.slider');
        });
}

//load dog breeds and create buttons for each breed
function loadDogBreeds() {
    fetch('https://api.thedogapi.com/v1/breeds')
        .then(res => res.json())
        .then(breeds => {
            const shuffled = breeds.sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, 10); 

            const container = document.getElementById('breedButtons');
            selected.forEach(breed => {
                const btn = document.createElement('button');
                btn.innerText = breed.name;
                btn.className = 'breed-button';
                btn.setAttribute('data-id', breed.id);
                btn.addEventListener('click', () => showBreedInfo(breed));
                container.appendChild(btn);
            });

            // Enable voice recognition if annyang is available
            if (annyang) {
                const commands = {
                    'load dog breed *name': function(name) {
                        const match = selected.find(b => b.name.toLowerCase() === name.toLowerCase());
                        if (match) showBreedInfo(match);
                        else alert('Breed not found in the top 10 selection!');
                    }
                };
                annyang.addCommands(commands);
                annyang.start();
            }
        })
        .catch(err => {
            console.error(err);
            alert('Error loading dog breeds.');
        });
}

// Function to display detailed information about the selected breed
function showBreedInfo(breed) {
    const info = document.getElementById('breedInfo');
    info.style.display = 'block';
    info.innerHTML = `
        <h3>${breed.name}</h3>
        <p>${breed.bred_for || 'No description available.'}</p>
        <p>Life Span: ${breed.life_span}</p>
    `;
}

