import {
    mapService
} from './services/map-service.js';
import {
    locationService
} from './services/location-service.js';

var gMap;
mapService.getLocs() // take the loc array from the map service
    .then(locs => console.log('locs', locs))

window.goToAdress = goToAdress;
window.currPosition = currPosition;



window.onload = () => {

    document.querySelector('.btn').addEventListener('click', (ev) => {
        console.log('Aha!', ev.target);
        panTo(35.6895, 139.6917);
    })

    initMap()
        .then(() => {
            addMarker({
                lat: 32.0749831,
                lng: 34.9120554
            });
        })
        .catch(() => console.log('INIT MAP ERROR'));

    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords);
        })
        .catch(err => {
            console.log('err!!!', err);
        })
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
        mapService.getLatLngByAdress(address);
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