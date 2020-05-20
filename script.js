$(document).ready(function(){
    var city="";
    var widget ="";
    var newCity =""; 
       
    
    document.getElementById('error').style.display = "none";    
    document.getElementById('currentWeatherBox').style.display = "none";
    document.getElementById('forecast5Days').style.display = "none";
    var imagWeather = document.getElementById('imgWeather');
    
    //Manage the dates
    var today = new Date();  
    var date = " (" + (today.getMonth()+1) +'/'+ today.getDate() +'/'+ today.getFullYear()+ ")";
    Date.prototype.addDays = function(days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    }

    var day1 = today.addDays(1);
    var date1 = (day1.getMonth()+1) +'/'+ day1.getDate() +'/'+ day1.getFullYear();

    var day2 = today.addDays(2);
    var date2 = (day2.getMonth()+1) +'/'+ day2.getDate() +'/'+ day2.getFullYear();

    var day3 = today.addDays(3);
    var date3 = (day3.getMonth()+1) +'/'+ day3.getDate() +'/'+ day3.getFullYear();

    var day4 = today.addDays(4);
    var date4 = (day4.getMonth()+1) +'/'+ day4.getDate() +'/'+ day4.getFullYear();

    var day5 = today.addDays(5);
    var date5 = (day5.getMonth()+1) +'/'+ day5.getDate() +'/'+ day5.getFullYear();

    //Getting the imgs of the weather of 5 days
    var img1 = document.getElementById('img1');
    var img2 = document.getElementById('img2');
    var img3 = document.getElementById('img3');
    var img4 = document.getElementById('img4');
    var img5 = document.getElementById('img5');

    //Search city function
    $("#submit").click(function(e){
        e.preventDefault();
        var city =$("#city").val();     
        GetWeather(city);  
    });
    
    //Shows last city search when you open the web browser
    let citiesArray = localStorage.getItem('city') ? JSON.parse(localStorage.getItem('city')) : [];
    document.getElementById('listCities').innerHTML = '';  
    var mylist = '';
    for(var i = 0; i < citiesArray.length; i++){
        mylist += '<option value="'+ citiesArray[i] +'" >';    
    }
    document.getElementById('listCities').innerHTML = mylist;
    GetWeather(citiesArray[citiesArray.length-1]);

    //Search for the weather of a given city
    function GetWeather(city){
        if(city != ""){      
            //Current weather      
            $.ajax({
                type: "POST",
                url: "http://api.openweathermap.org/data/2.5/weather?q=" +  city + "&appid=b51abdee5b3b9624a656ba1751e50530" + "&units=imperial",
                dataType: "json",
                success: function (result, status, xhr) {
                    
                    document.getElementById("city").value = "";
                    document.getElementById('error').style.display = "none";                     
                    document.getElementById('currentWeatherBox').style.display = "block";
                    document.getElementById("cityName").innerHTML  = result["name"]+ date;
                    document.getElementById("temperature").innerHTML  = "Temperature: "+result["main"]["temp"] + " °F";
                    document.getElementById("humidity").innerHTML  = "Humidity: "+result["main"]["humidity"] + " %";
                    document.getElementById("windSpeed").innerHTML  = "Wind Speed: "+result["wind"]["speed"] + " MPH"; 
                    
                    // Call the funtion getUV to get UV Index
                    getUV( result["coord"]["lat"] , result["coord"]["lon"]); 
                    imagWeather.src= "http://openweathermap.org/img/wn/"+result["weather"]["0"]["icon"]+"@2x.png";

                    //Search history
                    var exist = 0;

                    for(var i = 0; i < citiesArray.length; i++){
                        if (city == citiesArray[i] ) {
                            exist++; 
                        }   
                    }

                    if (exist == 0) {
                        citiesArray.push(city)
                        localStorage.setItem('city', JSON.stringify(citiesArray));  

                        citiesArray = localStorage.getItem('city') ? JSON.parse(localStorage.getItem('city')) : [];
                        document.getElementById('listCities').innerHTML = '';  
                        var mylist = '';
                        for(var i = 0; i < citiesArray.length; i++){
                            mylist += '<option value="'+ citiesArray[i] +'" >';    
                        }
                        document.getElementById('listCities').innerHTML = mylist;
                    }
                    
                },
                error: function (xhr, status, error) {
                    $("#error").html("Error, City " + error +".");                                       
                    document.getElementById('currentWeatherBox').style.display = "none";
                    document.getElementById('forecast5Days').style.display = "none";
                    document.getElementById('error').style.display = "block";
                }
            });

            ///// Get 5 Daily Forecast
            $.ajax({
                dataType: 'json',
                url: 'http://api.openweathermap.org/data/2.5/forecast/daily',
                data: {
                  q: city,
                  units: 'imperial',
                  appid: "927d09bc49dbee6aac7f5cb1df707542",
                  cnt: '6'
                }
              }).done(function(result) {
                   
                    document.getElementById('forecast5Days').style.display = "inline";
                    // Day 1
                    document.getElementById("day1").innerHTML  = date1;
                    img1.src= "http://openweathermap.org/img/wn/"+result["list"]["1"]["weather"]["0"]["icon"]+"@2x.png";
                    document.getElementById("temp1").innerHTML  = "Temperature: "+result["list"]["1"]["temp"]["eve"] + " °F";
                    document.getElementById("hum1").innerHTML  = "Humidity: "+result["list"]["1"]["humidity"] + " %";

                    // Day 2
                    document.getElementById("day2").innerHTML  = date2;
                    img2.src= "http://openweathermap.org/img/wn/"+result["list"]["2"]["weather"]["0"]["icon"]+"@2x.png";
                    document.getElementById("temp2").innerHTML  = "Temperature: "+result["list"]["2"]["temp"]["eve"] + " °F";
                    document.getElementById("hum2").innerHTML  = "Humidity: "+result["list"]["2"]["humidity"] + " %";

                    // Day 3
                    document.getElementById("day3").innerHTML  = date3;
                    img3.src= "http://openweathermap.org/img/wn/"+result["list"]["3"]["weather"]["0"]["icon"]+"@2x.png";
                    document.getElementById("temp3").innerHTML  = "Temperature: "+result["list"]["3"]["temp"]["eve"] + " °F";
                    document.getElementById("hum3").innerHTML  = "Humidity: "+result["list"]["3"]["humidity"] + " %";

                    // Day 4
                    document.getElementById("day4").innerHTML  = date4;
                    img4.src= "http://openweathermap.org/img/wn/"+result["list"]["4"]["weather"]["0"]["icon"]+"@2x.png";
                    document.getElementById("temp4").innerHTML  = "Temperature: "+result["list"]["4"]["temp"]["eve"] + " °F";
                    document.getElementById("hum4").innerHTML  = "Humidity: "+result["list"]["4"]["humidity"] + " %";

                    // Day 5
                    document.getElementById("day5").innerHTML  = date5;
                    img5.src= "http://openweathermap.org/img/wn/"+result["list"]["5"]["weather"]["0"]["icon"]+"@2x.png";
                    document.getElementById("temp5").innerHTML  = "Temperature: "+result["list"]["5"]["temp"]["eve"] + " °F";
                    document.getElementById("hum5").innerHTML  = "Humidity: "+result["list"]["5"]["humidity"] + " %";
              });
        }else{
            $("#error").html("Error, field cannot be empty.");                             
            document.getElementById('currentWeatherBox').style.display = "none";
            document.getElementById('forecast5Days').style.display = "none";
            document.getElementById('error').style.display = "block";
        } 
    }

    //Get the UV for the current day
    function getUV(lat, lon){
        $.ajax({
            type: "GET",
            url: "http://api.openweathermap.org/data/2.5/uvi?appid=b51abdee5b3b9624a656ba1751e50530&lat="+lat +"&lon="+lon,
            dataType: "json",
            success: function (result, status, xhr) {
                var uv = result["value"];
                document.getElementById("uv").innerHTML  = uv;
                let myUV = document.querySelector("#uv");
                if (uv > 0 && uv < 3) {
                    // 0 to 2	Green: #3ea72d
                    myUV.style.backgroundColor = "#3ea72d";
                    myUV.style.color = "#ffffff";
                }

                if (uv > 3 && uv < 6) {
                    //  3 to 5	Yellow  #fff300
                    myUV.style.backgroundColor = "#fff300";
                    myUV.style.color = "#000000";
                }

                if (uv > 6 && uv < 8) {
                   // 6 to 7	Orange #f18b00
                   myUV.style.backgroundColor = "#f18b00";
                   myUV.style.color = "#000000";
                }

                if (uv > 8 && uv < 11) {
                    //  8 to 10	Red  #e53210
                    myUV.style.backgroundColor = "#e53210";
                    myUV.style.color = "#ffffff";
                }

                if (uv > 11) {
                    //  11+	Violet  #b567a4
                    myUV.style.backgroundColor = "#b567a4";
                    myUV.style.color = "#ffffff";
                }

            },
            error: function (xhr, status, error) {
            }
        });    
    }
});


