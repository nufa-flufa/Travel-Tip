export const mapService = {
    getLocs,
    getLatLngByAdress
}
var locs = [{ lat: 11.22, lng: 22.11 }]

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}

function getLatLngByAdress(address){ // take an address and return an obj with formatted address and location
    const API_KEY = 'AIzaSyA17BYjyDxu05k6Xn8hWDDbMEdoghMsdGU'; //Enter your API Key   
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${API_KEY}`)
        .then(res => {
            return  res.data.results[0];
        })
        .then(info =>{
            return ({address:info.formatted_address,location:info.geometry.location});
        })
}
