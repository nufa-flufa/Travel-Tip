export const mapService = {
    getLocs,
    getLatLngByAdress,
    getWeatherbyLoc
}
var locs = [{
    lat: 11.22,
    lng: 22.11
}]

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}

function getLatLngByAdress(address) { // take an address and return an obj with formatted address and location
    const API_KEY = 'AIzaSyA17BYjyDxu05k6Xn8hWDDbMEdoghMsdGU'; //Enter your API Key   
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${API_KEY}`)
        .then(res => {
            return res.data.results[0];
        })
        .then(info => {
            console.log(info.formatted_address, info.geometry.location);
            return ({
                address: info.formatted_address,
                location: info.geometry.location
            });
        })
}

function getWeatherbyLoc(loc) {
    const API_WEATHER_KEY = 'd093543defbbdfd9fb6ae1e50ff16ab9';
    return axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${loc.lat}&lon=${loc.lng}&units=metric&APPID=${API_WEATHER_KEY}`)
        .then(weather => {
            console.log(weather.data.main.temp);
            return weather.data.main.temp;
        })
        .catch(err => {
            return 'cant find weather';
        })
}