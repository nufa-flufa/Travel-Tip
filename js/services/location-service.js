import { utilService } from './util-service.js';

export const locationService = {
    addLocation,
    getLocations,
    upDate
}

const LOCALKEY = 'TRAVTIP';

const locations = utilService.loadFromStorage(LOCALKEY) || [];

function addLocation(name,lat,lng){
    if(!name) return;
    const loc= {
        id:utilService.getRandomId(),
        name,
        lat,
        lng,
        weather: 'bla',
        createdAt:Date.now(),
        updateAt:null
    }
    locations.push(loc);
    utilService.saveToStorage(LOCALKEY,locations);
}

function getLocations(){
    return locations;
}

function upDate(id,key,value){
    locations[id][key] = value;
    locations[id].updateAt = Date.now();
}