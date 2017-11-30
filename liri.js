//If Twitter was used for this there would be code written to grab the data from keys.js. The keys would be stored in a variable.

//This file will be able to take in one of the following commands:
//my-tweets  ** see note below regarding Twitter **
//spotify-this-song (and song title in quotes)
//movie-this (and movie title in quotes)
//do-what-it-says


// TWITTER SECTION (not included)
//The command, 'node liri.js my-tweets,' would show that last 20 tweets and when they were created.
//I've excluded this piece from my code because of the privacy issues around setting up a Twitter account.


// SPOTIFY SECTION
//The command, 'node liri.js spotify-this-song '<song name here>',' will display information about the song.
//This will display in the terminal window:
//  Artist(s)
//  The song's name
//  A preview link of the song from Spotify
//  The album that the song is from
//If no song is provided then the program will default to "The Sign."


// OMDB SECTION
//The command, 'node liri.js movie-this '<movie name here>',' will display information about the movie.
//This will display in the terminal window:
//  Title of the movie
//  Year the movie came out
//  IMDB rating of the movie
//  Rotten Tomatoes rating of the movie
//  Country where the movie was produced
//  Language of the movie
//  Plot of the movie
//  Actors in the movie
//If no movie is typed in, data for the movie 'Mr. Nobody' will be displayed

//The fs Node package will be used for LIRI to use the text inside random.txt to call the do-what-it-says LIRI command
//This means it would run spotify-this-song for "I Want it That Way," as the random.txt file contains that text.

var action = process.argv[2];
var value = process.argv[3];
var request = require('request');
var fs = require('fs');
var Spotify = require('node-spotify-api');
var spotify = new Spotify({
    id: "e76c729b447f4347b573ba9b1bcb8945",
    secret: "3de2d7fd934841f399595bf3a48c6321"
});

switch (action) {
    case 'spotify-this-song':
        spotifyThis(value);
        break;
    case 'movie-this':
        omdbThis(value);
        break;
    case 'do-what-it-says':
        random();
        break;
}

//Here is the Spotify section
//This will be run if the spotify-this-song command is provided on the command line. If no value (song title) is
//provided, the default song used for the command will be "The Sign by Ace of Base."
//The spotify-this-song command will list the artist, song, preview link, and album the song is from - in the terminal output.

function spotifyThis(value) {

    if (value == null) {
        value = "album:The%20Sign%20artist:Ace%20of%20Base";
    }

    spotify
    .request('https://api.spotify.com/v1/search?q=' + value + '&type=track')
    .then(function(data) {
        console.log(data.tracks.items[0].artists[0].name);
        console.log(' ');
        console.log('Artist: ' + data.tracks.items[0].artists[0].name);
        console.log('Song: ' + data.tracks.items[0].name);
        console.log('Preview Link: ' + data.tracks.items[0].preview_url);
        console.log('Album: ' + data.tracks.items[0].album.name);
        console.log(' ');

        fs.appendFile('log.txt', '---------------------------------------------' + '\r\n'
        + Date() 
        + '\r\n\r\n' + 'TERMINAL COMMANDS: ' + process.argv 
        + '\r\n\r\n' + 'DATA OUTPUT: ' + '\r\n' 
        + 'Artist: ' + data.tracks.items[0].artists[0].name 
        + '\r\n' + 'Song: ' + data.tracks.items[0].name
        + '\r\n' + 'Preview Link: ' + data.tracks.items[0].preview_url 
        + '\r\n' + 'Album: ' + data.tracks.items[0].album.name 
        + '\r\n' + '---------------------------------------------' + '\r\n\r\n'
        );
    
    })
    .catch(function(err) {
        console.error('Error occurred: ' + err);
    });
};

//Here is the OMDB section
//This will be run if the movie-this command is provided on the command line. If no value (movie title) is
//provided, the default movie used for the command will be "Mr. Nobody."
//The movie-this command will list the title, release year, IMDB rating, Rotten Tomatoes rating, production country,
//language, plot, and actors - in the terminal output.

function omdbThis(value) {

    if (value == null) {
        value = 'Mr. Nobody';
    }

    request('http://www.omdbapi.com/?t=' + value + '&apikey=40e9cece&tomatoes=true&r=json', function (error, response, body) {
            
        if (!error && response.statusCode == 200) {
            jsonBody = JSON.parse(body);

            console.log(' ');
            console.log('Title: ' + jsonBody.Title);
            console.log('Year: ' + jsonBody.Year);
            console.log('IMDb Rating: ' + jsonBody.imdbRating);
            console.log('Rotten Tomatoes Rating: ' + jsonBody.tomatoRating);
            console.log('Country: ' + jsonBody.Country);
            console.log('Language: ' + jsonBody.Language);
            console.log('Plot: ' + jsonBody.Plot);
            console.log('Actors: ' + jsonBody.Actors);
            console.log(' ');

            fs.appendFile('log.txt', '---------------------------------------------' + '\r\n' 
            + Date() 
            + '\r\n\r\n' + 'TERMINAL COMMANDS: ' + process.argv 
            + '\r\n' + 'DATA OUTPUT:' + '\r\n' 
            + 'Title: ' + jsonBody.Title 
            + '\r\n' + 'Year: ' + jsonBody.Year 
            + '\r\n' + 'IMDb Rating: ' + jsonBody.imdbRating 
            + '\r\n' + 'Rotten Tomatoes Rating: ' + jsonBody.tomatoRating 
            + '\r\n' + 'Country: ' + jsonBody.Country 
            + '\r\n' + 'Language: ' + jsonBody.Language 
            + '\r\n' + 'Plot: ' + jsonBody.Plot 
            + '\r\n' + 'Actors: ' + jsonBody.Actors 
            + '\r\n' + '---------------------------------------------' + '\r\n\r\n'
            );

            if (error) {
                return console.log(error);
            }
        }
    });
}
      
//This pulls in the song title from the random file.
function random() {
    fs.readFile('random.txt', 'utf8', function (error, data) {

        if (error) {
            console.log(error);
        }

        else {
            var dataArr = data.split(',');
            if (dataArr[0] === 'spotify-this-song') {
                spotifyThis(dataArr[1]);
            }
        }
    });
}
