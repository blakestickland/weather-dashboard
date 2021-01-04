// script file for weather-dashboard

            // Global variables
            let citiesInput = $("#search-input");
            let citiesForm = $("#city-search-form");
            let citiesTable = $("#city-search-table");

            let citiesArray = [];
            
            let city = "";

            init();

            // Generic function for capturing the city name from the data-attribute
            var cityName = $(this).attr("data-name");

            // Function to fill the list of cities searched
            function renderTable() {
                
                // Delete the list of cities prior to adding new city table data 
                // (necessary to prevent repeat of table data)
                $("tbody").empty();

                // Loop through the array of cities
                for (var i = 0; i < citiesArray.length; i++) {
                    // Render new table row and table data elements for each city in the array.
                    var tRow = $("<tr>");
                    var tData = $("<td>");
                    var tSpan = $("<span>");

                    tSpan.addClass("city");
                    tData.attr("data-name", citiesArray[i]);
                    tData.attr("data-index", i);
                    tSpan.text(citiesArray[i]);

                    let button = $("<button>");
                    button.text("Remove");
                    button.attr("class", "btn-sm bg-danger rounded text-white");
                    
                    tData.append(tSpan);
                    tData.append(button);
                    tRow.append(tData);
                    $("tbody").append(tRow);
                }
            };


            function init() {
                // Get stored cities from localStorage
                // Parsing the JSON string to an object
                let storedCities = JSON.parse(localStorage.getItem("cities"));

                // If todos were retrieved from localStorage, update the todos array to it
                if (storedCities !== null) {
                    citiesArray = storedCities;
                    }
            
                // Render cities to the DOM
                renderTable();
            }

            function storeCities() {
                // Stringify and set "cities" key in localStorage to cities array
                localStorage.setItem("cities", JSON.stringify(citiesArray));
            }
            
            function sayHello(event) {
                event.preventDefault();
                alert("Hello!");
            }
            $("h1").on("click", sayHello);
            

            // When a city is entered in the Search input box...
            $("#run-search").on("click", function (event) {

                // event.preventDefault() prevents the form from trying to submit itself.
                // We're using a form so that the user can hit enter instead of clicking the button if they want
                event.preventDefault();
                
                // This grabs text from the input box
                city = citiesInput.val().trim();
                
                // Return from function early if cityText is blank
                if (city === "") {
                    alert("City Search must be filled-in");
                    return false;
                }
                
                // The city from the textbox is then added to our array, clear the input
                citiesArray.push(city);
                citiesInput.value = "";
                
                // calling renderTable which handles the processing of our cities array
                storeCities();
                renderTable();
                
                console.log(city + " before weatherQuery function");
                weatherQuery();
            });
               


            function weatherQuery() {
                
                // event.preventDefault() prevents the form from trying to submit itself.
                // We're using a form so that the user can hit enter instead of clicking the button if they want
                event.preventDefault();

                var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" +
                city + "&units=metric&APPID=2c21c13c66f088ce875b0a51abc2134e";

                console.log(city + " aftr API query");
  
                $.ajax({
                url: queryURL,
                method: "GET"
                }).then(function(response) {
                    var cityName = response.name;
                    // prepare the retrieved date data for html
                    const milliseconds = response.dt * 1000;
                    const dateObject = new Date(milliseconds);
                    const humanDateFormat = dateObject.toLocaleString("en-GB", {day: "numeric", month: "numeric", year: "numeric"});
                    
                    // Dynamically generate table rows and tables data for each city in the array.
                    $("#current-weather").empty();
                    
                    // Add date
                    var currentDate = $("<h4>");
                    currentDate.text(response.name + " " + "(" + humanDateFormat + ")");
                    $("#current-weather").append(currentDate);
                    
                    // Add weather icon
                    var icon = response.weather[0].icon;
                    var weatherIcon = ("http://openweathermap.org/img/wn/" + icon + "@2x.png");
                    var iconTag = $("<img>");
                    iconTag.attr("src", weatherIcon);
                    iconTag.attr("alt", "weather icon");
                    iconTag.attr("class", "responsive");
                    $("#current-weather").append(iconTag);


                    var currentTemp = $("<p>");
                    currentTemp.text("Temperature: " + response.main.temp + "\xB0" + "C");
                    $("#current-weather").append(currentTemp);
                            
                    var currentHumidity = $("<p>");
                    currentHumidity.text("Humidity: " + response.main.humidity + "%");
                    $("#current-weather").append(currentHumidity);
                                
                    var currentWSpeed = $("<p>");
                    currentWSpeed.text("Wind Speed: " + response.wind.speed + " km/h");
                    $("#current-weather").append(currentWSpeed);
                                    
                                    
                                    
                    // Step 2: Use the longitude and latitude from the Current weather data query to get weather data from the One Call API (free) which includes Daily forecast for 7 days, JSON format, and UV index data.
                    var queryURL2 = "https://api.openweathermap.org/data/2.5/onecall?lat=" + response.coord.lat + "&lon=" + response.coord.lon + "&exclude=minutely,hourly&units=metric&appid=2c21c13c66f088ce875b0a51abc2134e";
                    
                    $.ajax({
                        url: queryURL2,
                        method: "GET"
                    }).then(function(response) {
                        console.log(response);
                        console.log("UV Index: " + response.current.uvi);
                        
                        var button = $("<button>");
                        button.text(response.current.uvi);
                        button.attr("class", "btn rounded text-white");

                        var currentUV = $("<p>");
                        currentUV.text("UV Index: ");
                        currentUV.append(button);
                        $("#current-weather").append(currentUV);

                        // add UV index color here
                        var UVI = response.current.uvi; 
                        if (UVI < 3) {
                            // make green
                            button.attr("style", "background-color: rgb(44, 174, 21);");
                        }
                        else if (UVI >= 3 && UVI < 6) {
                            // make yellow
                            button.attr("style", "background-color: rgb(255, 227, 0);");
                            button.attr("class", "btn rounded text-black");
                        }             
                        else if (UVI >= 6 && UVI < 8) {
                            // make orange
                            button.attr("style", "background-color: rgb(255, 170, 0);");
                        }
                        else if (UVI >= 8 && UVI < 11) {
                            // make red
                            button.attr("style", "background-color: rgb(255, 0, 0);");
                        }
                        else {
                            // make violet
                            button.attr("style", "background-color: rgb(186, 85, 211);");
                        }
                    
                        


                        // 5-day forecast test
                        // prepare the retrieved date data for html
                        for (var i = 0; i < 5; i++) {
                            // create box for each day
                            
                            // add date
                            const milliseconds = response.daily[i].dt * 1000;
                            const dateObject = new Date(milliseconds);
                            const humanDateFormat = dateObject.toLocaleString("en-GB", {day: "numeric", month: "numeric", year: "numeric"});
                            // tomorrowDate.text(cityName + " " + "(" + humanDateFormat + ")");
                            let dailyDate = $("<h5>");
                            let dailyBox = "#date-day" + (i+1);
                            $(dailyBox).text(humanDateFormat);
                            
                            // add icon
                            let dailyIcon = "#icon-day" + (i+1);
                            let dailyWeatherIcon = "http://openweathermap.org/img/wn/" + (response.daily[i].weather[0].icon) + "@2x.png"
                            $(dailyIcon).attr("src", dailyWeatherIcon);

                            // add temp
                            let dailyTemp = "#temp-day" + (i+1);
                            $(dailyTemp).text("Temp: " + response.daily[i].temp.max + "\xB0" + "C");
                            
                            
                            // add humidity
                            let dailyHumid = "#humid-day" + (i+1);
                            $(dailyHumid).text("Humidity: " + response.daily[i].humidity + "%");
                            }; 
                        });                                    
                });
        
             };

             

      // When an element inside the citiesTable is clicked....
      citiesTable.on("click", function (event) {
        event.preventDefault();

        let element = event.target;

        // If that element is a button...
        if (element.matches("button") === true) {
            // Get its data-index value and remove the cities element from the table
            var index = element.parentElement.getAttribute("data-index");
            citiesArray.splice(index, 1);
            
            // Store updated cities in localStorage, re-render the table
            storeCities();
            renderTable();
        }
        // If that element is a span...
        if (element.matches("span") === true) {
            // Get its data-name value and run function weatherQuery with data-name
            var tableCityName = element.parentElement.getAttribute("data-name");
            city = tableCityName;
            weatherQuery();
        }
      });