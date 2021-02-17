import {
    utilService
} from './util-service.js';
import {
    mapService
} from './map-service.js';

export const locationService = {
    addLocation,
    getLocations,
    upDate
}

const LOCALKEY = 'TRAVTIP';

const locations = utilService.loadFromStorage(LOCALKEY) || [];

function addLocation(name, lat, lng) {
    const id = utilService.getRandomId()
    const loc = {
        id,
        name,
        lat,
        lng,
        weather: null,
        createdAt: Date.now(),
        updateAt: null
    }
    return new Promise(resolve =>extractWeather({
        lat,
        lng
    }).then(cel => {
        loc.weather = cel
        locations.push(loc);
        utilService.saveToStorage(LOCALKEY, locations);
        resolve();
    }))
    

}

function getLocations() {
    return locations;
}

function upDate(id, key, value) {
    locations[id][key] = value;
    locations[id].updateAt = Date.now();
}

function extractWeather({
    lat,
    lng
}) {
    const weat = mapService.getWeatherbyLoc({
        lat,
        lng
    });
    return weat.then(cel => {
        return cel;
    })
}