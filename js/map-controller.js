import {
    mapService
} from './services/map-service.js';
import {
    locationService
} from './services/location-service.js';
import {
    utilService
} from './services/util-service.js';

var gMap;
mapService.getLocs() // take the loc array from the map service
    .then(locs => console.log('locs', locs))

window.goToAdress = goToAdress;
window.currPosition = currPosition;
window.deleteCurrLocation = deleteCurrLocation;
window.panTo = panTo;




window.onload = () => {

    document.querySelector('.btn').addEventListener('click', (ev) => {
        console.log('Aha!', ev.target);
        panTo(35.6895, 139.6917);
    })

    initMap()
        .then(() => {
            var locations = locationService.getLocations()
            locations.map(location =>{
                var pos = {lat:location.lat, lng: location.lng}
                addMarker(pos, location.name)
            })
           
        })
        .catch(() => console.log('INIT MAP ERROR'));

    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords);
        })
        .catch(err => {
            console.log('err!!!', err);
        })
    renderUserTableInfo();
    setMarkersToMap();


}

function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap');
    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: {
                    lat,
                    lng
                },
                zoom: 15
            })
            gMap.addListener("click", (mapsMouseEvent) => {
                var pos = (mapsMouseEvent.latLng.toJSON());
                // link to new location 
                console.log('pos:', pos)
                var placeName = prompt('name the place')
                locationService.addLocation(placeName, pos.lat, pos.lng)

                renderUserTableInfo();
                var locations = locationService.getLocations()
                locations.map(location =>{
                    var pos = {lat:location.lat, lng: location.lng}
                    addMarker(pos,)
                })
                // setMarkersToMap();
                //mapsMouseEvent.latLng.toJSON() // this will give you the lat lng
            });
            console.log('Map!', gMap);
        })
}

function addMarker(loc, text) {

    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: text
    });
    return marker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}

function currPosition() {
    return getPosition()
        .then(pos => {
            const latLng = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            }
            panTo(latLng.lat,latLng.lng)
            console.log('User position is:', latLng);
            return latLng;
        })
        .catch(err => {
            console.log('err!!!', err);
        })

}

function goToAdress() {
    const address = document.querySelector('.search-address').value;
    if (address) {
       mapService.getLatLngByAdress(address)
       .then(pos =>{
           console.log(pos.address); // address name
           console.log(pos.location); // address loc
           panTo(pos.location.lat,pos.location.lng);
       })
    }

}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    })
}


function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyA17BYjyDxu05k6Xn8hWDDbMEdoghMsdGU'; //Enter your API Key
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}


function deleteCurrLocation(id) {
    var locations = locationService.getLocations();
    var locationIdx = locations.findIndex(location => location.id === id)
    locations.splice(locationIdx, 1);
    utilService.saveToStorage('TRAVTIP', locations)
    renderUserTableInfo();
    locations.forEach(location => {
        var pos = {lat: location.lat, lng: location.lng};
        addMarker(pos, location.name)
    })
}

function renderUserTableInfo() {
    const locations = locationService.getLocations()
    document.querySelector('.locations-table tbody').innerHTML = locations.map(location => {

        return `<tr>
        <td>${location.name}</td>
        <td>${location.lat}</td>
        <td>${location.lng}</td>
        <td>${location.weather}</td>
        <td><button onclick="panTo(${location.lat},${location.lng})">Go</button></td>
        <td><button onclick="deleteCurrLocation('${location.id}')">Delete</button></td>
        </tr>`
    }).join('');
}

function setMarkersToMap() {
    const locations = locationService.getLocations()
    locations.map(location => {
        var pos = { lat: location.lat, lng: location.lng };
        addMarker(pos, location.text)
    })
}
