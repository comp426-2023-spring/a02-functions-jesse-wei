#!/usr/bin/env node

import minimist from 'minimist';
import moment from 'moment-timezone';
import fetch from "node-fetch";

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
const latitude = 'n' in argv ? Math.round(argv.n * 100) / 100 : 's' in argv ? -Math.round(argv.s * 100) / 100 : undefined;
if (latitude == undefined)
    console.log('Latitude must be in range');

const longitude = 'e' in argv ? Math.round(argv.e * 100) / 100 : 'w' in argv ? -Math.round(argv.w * 100) / 100 : undefined;
if (longitude == undefined)
    console.log('Longitude must be in range');

const timezone = 'z' in argv ? argv.z : moment.tz.guess();

// API stuff
const url = "https://api.open-meteo.com/v1/forecast?latitude=" + latitude + "&longitude=" + longitude + "&daily=precipitation_hours&current_weather=true&timezone=" + timezone;
const response = await fetch(url);
const data = await response.json();

// if j flag exists, pretty print JSON and exit
if ('j' in argv) {
    console.log(JSON.stringify(data, null, 2));
    process.exit(0);
}

// Create response message
const days = 'd' in argv ? argv.d : 1;
const day_phrase = days == 0 ? "today." : days > 1 ? "in " + days + " days." : "tomorrow.";

if (data.daily.precipitation_hours[days] > 0)
    console.log(`You might need your galoshes ${day_phrase}`);
else
    console.log(`You probably won't need your galoshes ${day_phrase}`);