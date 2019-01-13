//install latest node v7 for async support: https://nodejs.org/en/download/current/

//npm install -g jquery
//npm install -g cheerio
//npm install -g request-promise

//make sure NODE_PATH envariable is set, e.g. %appdata%\npm\node_modules

/* use this to pull jquery into original weather page via debug console for trial and error testing
script = document.createElement("script");
script.src = "https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.1/jquery.min.js";
script.onload = function() { window.$ = $; };
document.getElementsByTagName("head")[0].appendChild(script);
*/

//(async function() { //started out thinking i'd use async http.get but couldn't immediately get that working

//from: http://stackoverflow.com/a/25622933
//var http = require("http");
var rp = require("request-promise");
var cheerio = require("cheerio");

var fs = require("fs");
var os = require("os");

/*
var weatherPage = await rp("http://www.yahoo.com/news/weather/united-states/washington/kenmore-2431488");
var jsdom = require("jsdom").jsdom; //couldn't quickly get the html back out, switched to cheerio since i saw an obvious example
var doc = jsdom(weatherPage);
var $ = require("jquery")(doc.defaultView);
//var page = $(weatherPage);
*/

rp({
  uri: "http://www.yahoo.com/news/weather/united-states/washington/seattle-2490383/",
  transform: cheerio.load
}).then(function ($) {

  //debug:fs.writeFileSync(process.env.TEMP + "/weatherDesk-beforeCleanup.htm", $.html());

  //pull the nifty background image... yahoo does a nice job of changing it up with an appropriate theme matched to the current weather
  var bgurl = $("div[id*='BackgroundPhoto'] div[style*='url']").first().css("background-image");
  if (bgurl) bgurl = bgurl.replace(/(url\(|\)|'|")/gi, '').split("https:");
  bgurl = "https:" + bgurl[bgurl.length - 1];
  //console.log("background: " + bgurl);
  
  //drop in the background image right on the body
  $("body").css({
    "background" : "url(" + bgurl + ") no-repeat center center fixed",  
    "background-size" : "cover"
  });

  //move all the nice clean "weather cards" out into the root body...
  $(".weather-card").appendTo("body");
  //remove the absolute positioning of the weather cards
  $(".weather-card.Pos\\(a\\)").removeClass("Pos(a)");
  //then drop all the other "fluff"
  $("body > *:not(.weather-card)").remove()
  $("script,meta,style").remove();
  $("link[rel!=stylesheet]").remove();
  //give a basic "responsive" style to let the weather cards "flow"
  $("<style>.weather-card { display: inline-block; float: right;}</style>").appendTo("head");
  
  //throw in the date and time since that was a script that got lost
  var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  var months = ['Jan','Feb','March','April','May','June','July','Aug','Sept','Oct','Nov','Dec'];
  var dayPostFixes = ['th','st','nd','rd','th'];
  var now = new Date();
  var mins = ("0" + now.getMinutes()).slice(-2);
  var hours = now.getHours();
  var endingDateDigit = now.getDate() % 10;
  var dateStr = months[now.getMonth()] + ' ' + now.getDate() + dayPostFixes[Math.min(endingDateDigit,4)] ;
  var timeStr = (hours > 12 ? (hours - 12) + ":" + mins + ' pm' : hours + ":" + mins + ' am');
  $("[data-type=location]").append('<div class="Tsh($temperature-text-shadow)" style="margin-top: 1em;">'+
    '<div style="font-size: xx-large;">'+ days[now.getDay()] +'</div>'+
    '<div style="font-size: xx-large;">'+ dateStr +'</div>'+
    '<div style="font-size: xx-large;">'+ timeStr+ '</div>'+
    '</div>');

  //*** remove various unwanted elements...
  $("[id^=Side-]").remove();
  //this targets the "star"/favorite and "change location" badge buttons
  $(".Mstart\\(40px\\)").remove();
  //just decided i don't need to see country
  $(".country").remove();
  //this removes the "C" for celsius link
  $(".unit-control").remove();
  $(".credit").remove();
  //couldn't get map images to render yet
  $("#weather-map").remove();
  //remove the scroll bar from hourly section
  $(".hourly").css("overflow-x", "hidden");
  //remove the 5 vs 10 day links at bottom of extended forecast
  $(".daily:not(.accordion)").remove();

  //some weather cards didn't work quite right as responsive and needed a hard coded width
  $("#weather-forecast").css("width", "600px");
  $(".wind-pressure > div > div").css("width", "65%");
  $("#weather-detail").css("width", "195px");
  //$("#weather-map").css("width", "500px");
  //$(".accordion").css("height", "250px"); //this is the hourly+daily forecast card, but wound up squeezing it in full height afterall

  //combine the city & big temp card into a block
  var div = $('<div></div>');
  div.append($("[data-type=temperature]"))
  div.append($("[data-type=location]"));
  //and then combine that on top of the hourly+daily forecast to be a block that all gets flowed together
  var div2 = $('<div style="float: right;"></div>');
  div2.append(div);
  div2.append($("[data-type=forecast]"));
  div2.prependTo("body");

  //lastly save the resulting html out to html file to be rendered
  fs.writeFileSync(process.env.TEMP + "/weatherDesk.htm", $.html());

}).catch(function (err) {
  console.log(err);
});;

//})();