#!/usr/bin/env node
import minimist from 'minimist';
import moment from 'moment-timezone';
import fetch from "node-fetch";
var argv = minimist(process.argv.slice(2));
if (argv.h) {
    console.log("Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE\n    -h            Show this help message and exit.\n    -n, -s        Latitude: N positive; S negative.\n    -e, -w        Longitude: E positive; W negative.\n    -z            Time zone: uses tz.guess() from moment-timezone by default.\n    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.\n    -j            Echo pretty JSON from open-meteo API and exit.\n");
    process.exit(0);
}
const latitude = argv.n ? Math.round(argv.n * 100) / 100 : argv.s ? -Math.round(argv.s * 100) / 100 : undefined;
if (latitude == undefined) console.log('Latitude must be in range');
const longitude = argv.e ? Math.round(argv.e * 100) / 100 : argv.w ? -Math.round(argv.w * 100) / 100 : undefined;
if (longitude == undefined) console.log('Longitude must be in range');
const timezone = argv.z ?? moment.tz.guess();
const url = "https://api.open-meteo.com/v1/forecast?latitude=" + latitude + "&longitude=" + longitude + "&daily=precipitation_hours&current_weather=true&timezone=" + timezone;
const response = await fetch(url);
const data = await response.json();
if (argv.j) {
    console.log(JSON.stringify(data, null, 2));
    process.exit(0);
}
const days = argv.d ?? 1;
const day_phrase = days == 0 ? "today." : days > 1 ? "in " + days + " days." : "tomorrow.";
if (data.daily.precipitation_hours[days] > 0) console.log(`You might need your galoshes ${day_phrase}`);
else console.log(`You probably won't need your galoshes ${day_phrase}`);