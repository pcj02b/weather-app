const weatherForm = document.querySelector('form');
const search = document.querySelector('input');

const temperatureParagraph = document.querySelector('#CurrentTemp');
const feelsLikeParagraph = document.querySelector('#FeelsLike');

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault();

    temperatureParagraph.textContent = 'loading...';
    feelsLikeParagraph.textContent = null;

    fetch(`/weather?address=${encodeURIComponent(search.value)}`).then((response) => {
        response.json().then((data) => {
            if (data.error){
                temperatureParagraph.textContent = data.error;
                return;
            }
            temperatureParagraph.textContent = 'Current Temp: ' + data.temperature;
            feelsLikeParagraph.textContent = 'Feels Like: ' + data.feelslike;
        })
    })
});