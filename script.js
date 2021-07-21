window.addEventListener("load", () => { //When page loads declare longitude and latitude variables
    let long;
    let lat;
})

var temperatureH1 = document.getElementById("temperatureH1"); //Storing the temperature h1 to variable

document.getElementsByClassName("temperature")[0].onclick = function(){ //When temperature div clicked convert celsius to fahrenheit or vice versa
    const celsius = "C";
    const fahrenheit = "F";
    var tempDegree = document.getElementById("tempDegree").innerText;
    var tempDegreeH1 = document.getElementById("tempDegree");
    if(tempDegree == "C"){ //If current temp degree equals C
        tempDegreeH1.innerHTML = "";
        tempDegreeH1.append(fahrenheit);
        currentTemp = temperatureH1.innerText * 9 / 5 + 32;
        temperatureH1.innerHTML = ""
        temperatureH1.append(currentTemp);
    }
    if(tempDegree == "F"){ //If current temp degree equals F
        tempDegreeH1.innerHTML = "";
        tempDegreeH1.append(celsius);
        currentTemp = (temperatureH1.innerText - 32) * 5 / 9;
        currentTemp = Math.round(currentTemp);
        temperatureH1.innerHTML = "";
        temperatureH1.append(currentTemp);
    }
};

if(navigator.geolocation){ //If location can be found run

    navigator.geolocation.getCurrentPosition(positon => { //Get current position and store longitude and latitude into declared variables  
        long = positon.coords.longitude;
        lat = positon.coords.latitude;

        //Storing google geocoding API into a variable. This includes the current longitude and latitude aswell as API key
        const geocodingAPI = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' +  long + '&key=' + config.GEOCODING_API_KEY;

        
        //Storing metoffice API into a variable. This includes the API key
        const metofficeAPI = 'http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/sitelist?&key=' + config.METOFFICE_API_KEY;

        !async function(){ //Async function makes sure promise is returned 
            let geocodingData = await fetch(geocodingAPI) //Fetch geocoding API and wait until result returned 
                .then((response) => response.json()) //Convert reponse into json format 
                .then(geocodingData => { //Return fetch so it can be stored in variable 
                    return geocodingData;
                })
                .catch(error => { //When promise failed or rejected
                    console.error(error);
                });
                    
                const {compound_code} = geocodingData.plus_code; //Storing place in variable 
                var place = compound_code.slice(8).split(',')[0]; //Slice and split compound_code variable to cut unnecessary data

                var locationH1 = document.getElementById("locationH1"); //Getting location h1 so place can be appended to it
                locationH1.innerHTML = "";
                locationH1.append(place);

            let metofficeData = await fetch(metofficeAPI) //Fetch metoffice API and wait until result returned 
                .then((response) => response.json()) //Convert reponse into json format 
                .then(metofficeData => { 
                    return metofficeData; //Return fetch so it can be stored in variable 
                })
                .catch(error => { //When promise failed or rejected
                    console.error(error);
                });

                var length = metofficeData.Locations.Location.length; //Storing size of metoffice array (amount of locations)
                
                for(x = 0;x < length; x++){ //Iterate through each array item in metoffice API and checking current location matches any metoffice items
                    var arrIndex = metofficeData.Locations.Location[x].name;
                    if(arrIndex == place){ //If match break
                        break;
                    }
                }

                if(x == 6002){ //If x equals 6002 this means it has got to the end of array without match
                    alert("Sorry the temperature for this location cannot be found")
                }

                locationID = metofficeData.Locations.Location[x].id; //Get the ID of the matched location
                
                //Storing new API request that searches for the current location
                const filteredMetofficeAPI = ('http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/' + locationID + '?res=3hourly&key=' + config.METOFFICE_API_KEY)

            let weatherData = await fetch(filteredMetofficeAPI) //Fetch filtered metoffice API and wait until result returned 
                .then((response) => response.json()) //Convert reponse into json format 
                .then(weatherData => { //Return fetch so it can be stored in variable 
                    return weatherData;
                })
                .catch(error => { //When promise failed or rejected
                    console.error(error);
                });


                var hourlyForecastLength = weatherData.SiteRep.DV.Location.Period[0].Rep.length; //Storing 3 hourly forecast into variable

                //Get current hour

                var today = new Date();
                var time = today.getHours()

                var minusCount = 0;

                //These if statements will declare minusCount depending on the current time. minusCount is subtracted from hourlyForecastLength to give the current hour forecast

                if(time >= 0 && time < 3){ //time is between midnight and 3am
                    minusCount = 7;
                }
                else if(time >= 3 && time < 6){ //time is between 3am and 6am
                    minusCount = 6;
                }
                else if(time >= 6 && time < 9){ //time is between 6am and 9am
                    minusCount = 5;
                }
                else if(time >= 9 && time < 12){ //time is between 9am and 12pm
                    minusCount = 4;
                }
                else if(time >= 12 && time < 15){ //time is between 12pm and 15pm
                    minusCount = 3;
                }
                else if(time >= 15 && time < 18){ //time is between 15pm and 18pm
                    minusCount = 2;
                }
                else if(time >= 18 && time < 21){ //time is between 18pm and 21pm
                    minusCount = 1;
                }
                else if(time >= 21){ //time is between 21pm and 0pm
                    minusCount = 0;
                }

                var hourlyForecast = hourlyForecastLength - minusCount - 1; //Index number that equals to current time
                var currentTemp = weatherData.SiteRep.DV.Location.Period[0].Rep[hourlyForecast].T; //Storing current temp using hourlyForecast variable
                
                temperatureH1.innerHTML = ""; //Clear current temperature
                temperatureH1.append(currentTemp); //Append current temperature 

        }();
    })
}
else{ //If current positon not found then alert
    alert("Sorry your current position cannot be found");
}




