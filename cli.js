#!/usr/bin/env node

import minimist from 'minimist';
import moment from 'moment-timezone';

var argv = (minimist)(process.argv.slice(2));


// Help message
if ('h' in argv) {
    console.log("Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE");
    console.log("    -h            Show this help message and exit.");
    console.log("    -n, -s        Latitude: N positive; S negative.");
    console.log("    -e, -w        Longitude: E positive; W negative.");
    console.log("    -z            Time zone: uses tz.guess() from moment-timezone by default.");
    console.log("    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.");
    console.log("    -j            Echo pretty JSON from open-meteo API and exit.");
    process.exit(0);
}

// Get CLI arguments
var latitude;
if ('n' in argv)
    latitude = Math.round(argv.n * 100) / 100;
else if ('s' in argv)
    latitude = -Math.round(argv.s * 100) / 100;

var longitude;
if ('e' in argv)
    longitude = Math.round(argv.e * 100) / 100;
else if ('w' in argv)
    longitude = -Math.round(argv.w * 100) / 100;

const timezone = 'z' in argv ? argv.z : moment.tz.guess();

// Api stuff
const url = "https://api.open-meteo.com/v1/forecast?latitude=" + latitude + "&longitude=" + longitude + "&daily=precipitation_hours&current_weather=true&timezone=" + timezone;
const response = await fetch(url);
const data = await response.json();

// j flag
if ('j' in argv) {
    console.log(JSON.stringify(data, null, 2));
    process.exit(0);
}

// Create response message
var day_phrase;
const days = 'd' in argv ? argv.d : 1;
if (days == 0)
    day_phrase = "today.";
else if (days > 1)
    day_phrase = "in " + days + " days.";
else {
    day_phrase = "tomorrow.";
}

if (data.daily.precipitation_hours[days] > 0) {
    console.log(`You might need your galoshes ${day_phrase}`);
} else {
    console.log(`You probably won't need your galoshes ${day_phrase}`);
}