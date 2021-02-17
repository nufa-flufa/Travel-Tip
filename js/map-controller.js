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
var gMarkers = [];
mapService.getLocs() // take the loc array from the map service
    .then(locs => console.log('locs', locs))

window.goToAdress = goToAdress;
window.currPosition = currPosition;
window.deleteCurrLocation = deleteCurrLocation;
window.panTo = panTo;
window.renderLink = renderLink;



window.onload = () => {
    document.querySelector('.btn').addEventListener('click', (ev) => {
        //console.log('Aha!', ev.target);
        panTo(35.6895, 139.6917);
    })

    const urlParams = new URLSearchParams(window.location.search);
    const latParams = +urlParams.get('lat') || 32.0749831;
    const lngParam = +urlParams.get('lng') || 34.9120554;

    initMap(latParams, lngParam)
        .then(() => {
            var locations = locationService.getLocations()
            locations.map(location => {
                var pos = {
                    lat: location.lat,
                    lng: location.lng
                }
                gMarkers.push(addMarker(pos, location.name));
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


}

function initMap(lat = 32.0749831, lng = 34.9120554) {
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
                console.log('pos:', pos)
                var placeName = prompt('name the place')
                locationService.addLocation(placeName, pos.lat, pos.lng).then(renderUserTableInfo)
                /*var locations = locationService.getLocations()
                locations.map(location => {
                    var pos = {
                        lat: location.lat,
                        lng: location.lng
                    }
                    gMarkers.push(addMarker(pos, location.name));
                })*/
                clearMarkers();
                gMarkers.push(addMarker(pos, location.name));
                renderMarkers();
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

function clearMarkers() {
    gMarkers.forEach(marker => {
        marker.setMap(null);
    })
    gMarkers = new Array();
}

function renderMarkers() {
    var locations = locationService.getLocations()
    locations.map(location => {
        var pos = {
            lat: location.lat,
            lng: location.lng
        }
        gMarkers.push(addMarker(pos, location.name));
    })
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
            panTo(latLng.lat, latLng.lng)
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
            .then(pos => {
                document.querySelector('.location').innerText = `Location: ${pos.address}`
                console.log(pos.address); // address name
                console.log(pos.location); // address loc
                panTo(pos.location.lat, pos.location.lng);
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

function renderLink(lat, lng) {
    const baseLink = 'https://nufa-flufa.github.io/Travel-Tip/?'
    const addOn = `lat=${lat}&lng=${lng}`;
    utilService.copyTextToClipboard(baseLink + addOn);
}

function deleteCurrLocation(id) {
    var locations = locationService.getLocations();
    var locationIdx = locations.findIndex(location => location.id === id)
    locations.splice(locationIdx, 1);
    console.log('delete')
    utilService.saveToStorage('TRAVTIP', locations)
    renderUserTableInfo();
    console.log('rendering table')
    clearMarkers();
    renderMarkers();
}

function renderUserTableInfo() {
    const locations = locationService.getLocations()
    console.log('locations to render:', locations)
    document.querySelector('.locations-table tbody').innerHTML = locations.map(location => {
        return `<tr>
        <td>${location.name}</td>
        <td>${location.lat}</td>
        <td>${location.lng}</td>
        <td>${location.weather}℃</td>
        <td><button class="btn" onclick="panTo(${location.lat},${location.lng})">Go</button></td>
        <td><button class="btn" onclick="deleteCurrLocation('${location.id}')">Delete</button></td>
        <td><button  class="btn" onclick="renderLink('${location.lat}','${location.lng}')">Share</button></td>
        </tr>`
    }).join('');
}

function setMarkersToMap() {
    const locations = locationService.getLocations()
    locations.map(location => {
        var pos = {
            lat: location.lat,
            lng: location.lng
        };
        addMarker(pos, location.text)
    })
}