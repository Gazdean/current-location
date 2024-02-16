import axios from 'axios';

export function fetchData(currentLocation) {
  console.log(currentLocation)
  return axios
    .get('https://www.refugerestrooms.org/api/v1/restrooms/by_location?page=1&per_page=30&offset=0&unisex=true&lat=53.42189467984313&lng=-2.2434425443392785')
    .then((response) => {
      return response.data
    })
}