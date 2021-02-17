import { utilService } from './util-service';
export const locationService = {
    addLocation,
    getLocation,
    upDate
}

const LOCALKEY = 'TRAVTIP';

const locations = utilService.loadFromStorage(LOCALKEY) || [];

function addLocation(name,lat,lng){
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

function getLocation(){
    return locations;
}

function upDate(id,key,value){
    locations[id][key] = value;
    locations[id].updateAt = Date.now();
}