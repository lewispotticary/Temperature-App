window.addEventListener("load", () => {
    let long;
    let lat;
})

var temperatureH1 = document.getElementById("temperatureH1");

document.getElementsByClassName("temperature")[0].onclick = function(){
    const celsius = "C";
    const fahrenheit = "F";
    var tempDegree = document.getElementById("tempDegree").innerText;
    var tempDegreeH1 = document.getElementById("tempDegree");
    if(tempDegree == "C"){
        tempDegreeH1.innerHTML = "";
        tempDegreeH1.append(fahrenheit);
        currentTemp = temperatureH1.innerText * 9 / 5 + 32;
        temperatureH1.innerHTML = "";
        temperatureH1.append(currentTemp);
    }
    if(tempDegree == "F"){
        tempDegreeH1.innerHTML = "";
        tempDegreeH1.append(celsius);
        currentTemp = (temperatureH1.innerText - 32) * 5 / 9;
        currentTemp = Math.round(currentTemp);
        temperatureH1.innerHTML = "";
        temperatureH1.append(currentTemp);
    }
};


if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(positon => {
        long = positon.coords.latitude;
        lat = positon.coords.longitude;

        const geocodingAPI = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + long + ',' +  lat + '&key=' + config.GEOCODING_API_KEY;

        console.log(geocodingAPI);

        const metofficeAPI = 'http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/sitelist?&key=' + config.METOFFICE_API_KEY;
        console.log(metofficeAPI);

        !async function(){
            let geocodingData = await fetch(geocodingAPI)
                .then((response) => response.json())
                .then(geocodingData => {
                    return geocodingData;
                })
                .catch(error => {
                    console.error(error);
                });
                    
                const {compound_code} = geocodingData.plus_code; 
                console.log(compound_code);
                var place = compound_code.slice(8).split(',')[0];
                console.log(place);

                var locationH1 = document.getElementById("locationH1");
                locationH1.innerHTML = "";
                locationH1.append(place);

            let metofficeData = await fetch(metofficeAPI)
                .then((response) => response.json())
                .then(metofficeData => {
                    return metofficeData;
                })
                .catch(error => {
                    console.error(error);
                });

                var length = metofficeData.Locations.Location.length;
                
                for(x = 0;x < length; x++){
                    var arrIndex = metofficeData.Locations.Location[x].name;
                    if(arrIndex == place){
                        break;
                    }
                }

                if(x == 6002){
                    alert("Sorry the temperature for this location cannot be found")
                }

                locationID = metofficeData.Locations.Location[x].id;
                
                const filteredMetofficeAPI = ('http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/' + locationID + '?res=3hourly&key=' + config.METOFFICE_API_KEY)
                console.log(filteredMetofficeAPI);

            let weatherData = await fetch(filteredMetofficeAPI)
                .then((response) => response.json())
                .then(weatherData => {
                    return weatherData;
                })
                .catch(error => {
                    console.error(error);
                });


                var hourlyForecastLength = weatherData.SiteRep.DV.Location.Period[0].Rep.length;
                console.log(hourlyForecastLength);

                var today = new Date();
                var time = today.getHours()
                var minusCount = 0;

                if(time >= 0 && time < 3){
                    console.log("time is between midnight and 3am");
                    minusCount = 7;
                }
                else if(time >= 3 && time < 6){
                    console.log("time is between 3am and 6am");
                    minusCount = 6;
                }
                else if(time >= 6 && time < 9){
                    console.log("time is between 6am and 9am");
                    minusCount = 5;
                }
                else if(time >= 9 && time < 12){
                    console.log("time is between 9am and 12pm");
                    minusCount = 4;
                }
                else if(time >= 12 && time < 15){
                    console.log("time is between 12pm and 15pm");
                    minusCount = 3;
                }
                else if(time >= 15 && time < 18){
                    console.log("time is between 15pm and 18pm");
                    minusCount = 2;
                }
                else if(time >= 18 && time < 21){
                    console.log("time is between 18pm and 21pm");
                    minusCount = 1;
                }
                else if(time >= 21){
                    console.log("time is between 21pm and 0pm");
                }

                var hourlyForecast = hourlyForecastLength - minusCount - 1;
                console.log(hourlyForecast);
                var currentTemp = weatherData.SiteRep.DV.Location.Period[0].Rep[hourlyForecast].T;
                
                
                temperatureH1.innerHTML = "";
                temperatureH1.append(currentTemp);

                
        }();
    })
}




