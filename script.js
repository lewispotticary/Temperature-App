window.addEventListener("load", () => {
    let long;
    let lat;
})

if(navigator.geolocation){

    navigator.geolocation.getCurrentPosition(positon => {
        long = positon.coords.latitude;
        lat = positon.coords.longitude;

        const geocodingAPI = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + long + ',' +  lat + '&key=' + config.GEOCODING_API_KEY;

        const metofficeAPI = 'http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/sitelist?&key=' + config.METOFFICE_API_KEY;
        console.log(metofficeAPI);

        fetch(geocodingAPI)
            .then(response => {
                return response.json();
            })
            .then(data => {
                const {compound_code} = data.plus_code; 
                var place = compound_code.split(' ')[1].replace(/,\s*$/, ""); 
                console.log(place);  
                return place;   
            })

        fetch(metofficeAPI)
            .then(response => {
                return response.json();
            })
            .then(data => {
                console.log(data);
                const length = data.Locations.Location.length;

                console.log(place);

                for(x = 0; x < length; x++){
                    arrIndex = data.Locations.Location[x].name;
                    if(arrIndex == location){
                        break;
                    }
                }

                console.log(arrIndex);
            })
    })
}


