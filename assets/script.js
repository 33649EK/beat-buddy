//fire on DOM load
$(document).ready(function () {
  var keyYT = `AIzaSyC348gfVsQumQjlTUFmjmsL3mC1_nC4-IU`
  var songInput = localStorage.getItem(`songInput`);
  var artistInput = localStorage.getItem(`artistInput`);


  // Function to check localStorage for data and diplay on history page
  function displayHistory() {
    var historyList = document.getElementById('history');
    console.log("displayHistory() has fired");  
  
    if (historyList) {
      for (var i = 20; i > 0; i--) {
        var searchSong = `song${i}`
        var searchArtist = `artist${i}`;
  
        var song = localStorage.getItem(searchSong);
        var artist = localStorage.getItem(searchArtist);
  
        if (song !== null && artist !== null) {
          var listItem = document.createElement('li');
          listItem.classList.add(`historyList`)
          listItem.textContent = `Song: ${song}, Artist: ${artist}`;
          historyList.appendChild(listItem);
        }
      }
    }
  }
  
  if (document.URL.includes('history.html')) {
    displayHistory();
  }

  // Clear history button, not functional, its not being seen for some reason, no console log when clicked
//   if (document.URL.includes('display.html')) {
//     var clearBTN = document.getElementById('hide');
//     console.log(clearBTN)

//     clearBTN.addEventListener('click', function () {
//         console.log('Clear history button clicked');
//         localStorage.clear();
//     });
// }
  
  


  var numLog = parseInt(localStorage.getItem(`singleTick`)) || 1;
  var digit = [numLog]; //make an array with current log count

// function to incremement log count and update local storage
  function singleTick() {
    numLog++;
    localStorage.setItem(`singleTick`, JSON.stringify(numLog));

    return numLog;
  }

  // singleTick(numLog) Event handler for submit button
  $("#submitButton").on("click", function () {
    //get input values and trim extra space
    var currentSong = $("#songInput").val().trim();
    var currentArtist = $("#artistInput").val().trim();
    localStorage.setItem(`songInput`, currentSong);
    localStorage.setItem(`artistInput`, currentArtist);
    var songInput = localStorage.getItem(`songInput`);
    var artistInput = localStorage.getItem(`artistInput`);

    
    //log input values
    console.log(songInput);
    console.log(artistInput);


    //empty input fields
    $("#songInput").val("");
    $("#artistInput").val("");

    //update class and localStorage based on the log count
    singleTick();
    console.log(numLog);
    console.log(this);

    


    $(this).attr("class", `class${digit[0]}`);

    //set local storage for each user entry with song and artist entered
    if ($(this).attr("class") === `class${digit[0]}`) {
      localStorage.setItem(`song${digit[0]}`, songInput);
      localStorage.setItem(`artist${digit[0]}`, artistInput);




      //checks if there is data in localStorage for the current log
      var checkStorageForData = localStorage.getItem(`song${digit[0]}`);

      if (checkStorageForData) {
        //toggle footer visibility if there is history data
        $(`#footer`).toggleClass(`hidden custom-label`);

        $(`#submitButton`).toggleClass(`data${digit[0]} data${digit[0] + 1}`);
      }
   
      //add log count to the array and log it
      digit.push(numLog);
      console.log(numLog);
      window.location.href = "display.html";
    }
  });


  if (document.URL.includes(`display.html`)) {
          //fetch data from apis
          fetchSongData(songInput, artistInput);
          fetchArtistData(artistInput);
    var currentSongFetch = localStorage.getItem(`song${digit[0]-1}`)
    var currentArtistFetch = localStorage.getItem(`artist${digit[0]-1}`)
      console.log("Current Song:", currentSongFetch);
      console.log("Current Artist:", currentArtistFetch);


// Thumbnail Generation for Youtube 
function createThumbnail(videoId, title) {
  var thumbnailContainer = document.createElement('div');
  thumbnailContainer.classList.add('youtubeDynamics');

  // Create thumbnail image
  var thumbnailImg = document.createElement('img');
  thumbnailImg.src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  thumbnailImg.width = 560;
  thumbnailImg.height = 315;
  thumbnailContainer.appendChild(thumbnailImg);

  // Create title element
  var titleElement = document.createElement('h3');
  titleElement.textContent = title;
  thumbnailContainer.appendChild(titleElement);

  // Add click event to open video on YouTube
  thumbnailContainer.addEventListener('click', function () {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  });

  return thumbnailContainer;
}

    var heroApiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=song${currentSongFetch}music-artist${currentArtistFetch}&maxResults=1&type=video&key=${keyYT}`;

    fetch(heroApiUrl)
    .then((response) => response.json())
    .then((data) => {
      var videos = data.items;
      videos.forEach((video) => {
        var videoTitle = `${currentSongFetch} by ${currentArtistFetch}`
        var videoId = video.id.videoId;
        var videoStorage = document.getElementById(`hero`)
        var createTitle = document.createElement(`h1`)
        createTitle.id = `titleCard`
        videoStorage.appendChild(createTitle)
        var thumbnailElement = createThumbnail(videoId, video.snippet.title);
        videoStorage.appendChild(thumbnailElement)
        createTitle.innerHTML = `${videoTitle}`
      });
    })
    .catch((error) => console.error("Error fetching data:", error));

    // var genreBreak = localStorage.getItem(`newGenres`)
    var genreBreak = `song like ${currentArtistFetch} by ${currentSongFetch}`
    console.log(genreBreak)

    var apiUrlRecommendations = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${genreBreak}&maxResults=3&type=video&key=${keyYT}`;
    
    fetch(apiUrlRecommendations)
      .then((response) => response.json())
      .then((data) => {
        var videos = data.items;
    
        var recommendationsStorage = document.getElementById('recommends');
    
        videos.forEach((video) => {
          var videoId = video.id.videoId;
          
          // Create thumbnail with title and link
          var thumbnailElement = createThumbnail(videoId, video.snippet.title);
          recommendationsStorage.appendChild(thumbnailElement);
        });
      })
      .catch((error) => console.error("Error fetching recommendations data:", error));



  // Make the fetch request to MusicBrainz API for entered artist
  function fetchArtistData(artistInput) {
    if (artistInput) {
      const musicBrainzApiUrl = `https://musicbrainz.org/ws/2/artist/?query=${artistInput}&fmt=json&limit=5`;
      //Fetch artist Id number from musicBrainz
      fetch(musicBrainzApiUrl)
        .then((response) => {
          if (response.ok === false) {
            //display error if api data is not successfully fetched
            throw Error(`Failed to fetch data: ${response.statusText}`);
          }
          //otherwise, return the response in json format
          return response.json();
        })
        .then((artistID) => {
          //console.log(artistID);
          // Check for results
          if (artistID.artists && artistID.artists.length > 0) {
            const artist = artistID.artists[0]; // Assuming the first result is the most relevant
            const artistId = artist.id;

            fetchReleases(artistId);
            fetchSingles(artistId);
            // Fetch artist genres
            const genreUrl = `https://musicbrainz.org/ws/2/artist/${artistId}?inc=genres&fmt=json`;
            return fetch(genreUrl);
          } else {
            //console log error if matching song/artist name are not found
            throw Error("No results found for the given artist name.");
          }
        })
        .then((response) => {
          if (response.ok === false) {
            throw Error(`Failed to fetch data: ${response.statusText}`);
          }
          return response.json();
        })
        .then((artistGenres) => {
          //console.log(artistGenres);
          // Extract and log the genre information
          if (artistGenres.genres && artistGenres.genres.length > 0) {
            const genres = artistGenres.genres.map((genre) => genre.name);
            // console.log(`Genres for ${artistInput}: ${genres.join(", ")}`);

            const existingGenres = localStorage.getItem("genres");
            var localStorageGenres = existingGenres
              ? JSON.parse(existingGenres)
              : [];
            //Creates new genre string
            var newGenres = `${artistInput}:${genres}`;
            console.log(newGenres);
            localStorage.setItem(`newGenres`, newGenres)

            var ifExists = localStorageGenres.includes(newGenres);
            //Does not add new genre string if it already exists within localstorage array
            console.log(ifExists);
            if (ifExists) {
              console.log("Artist already present in localstorage");
            } else {
              //Pushes new genre to existing genre array if it does not already exist and resets the 'genres' localstorage item
              localStorageGenres.push(newGenres);
              localStorage.setItem(
                "genres",
                JSON.stringify(localStorageGenres)
              );
            }
            compareGenres();
            console.log(localStorageGenres);
          } else {
            console.log(`No genre information for ${artistInput}`);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          // $("#error-message").text("Please submit a valid song/artist!");
        });

      //Fetch latest album releases from the user submitted artist
      function fetchReleases(artistId) {
        const albumsUrl = `https://musicbrainz.org/ws/2/release?artist=${artistId}&limit=25&inc=recordings&type=album&fmt=json`;
        fetch(albumsUrl)
          .then((response) => {
            if (response.ok === false) {
              throw Error(`Failed to fetch data: ${response.statusText}`);
            }
            return response.json();
          })
          .then((albumInfo) => {
            //console.log(albumInfo);

            if (albumInfo.releases && albumInfo.releases.length > 0) {
              const albums = albumInfo.releases.map((albums) => albums.title);
              //console.log(`Albums for ${artistInput}: ${albums.join(", ")}`);

              localStorage.setItem("albums", JSON.stringify(albums));
              // window.location.href = "display.html";
            } else {
              console.log(`No album information for ${artistInput}`);
            }
          });
      }
      //Fetches singles data
      function fetchSingles(artistId) {
        const singlesUrl = `https://musicbrainz.org/ws/2/release?artist=${artistId}&limit=25&inc=recordings&type=single&fmt=json`;
        fetch(singlesUrl)
          .then((response) => {
            if (response.ok === false) {
              throw Error(`Failed to fetch data: ${response.statusText}`);
            }
            return response.json();
          })
          .then((singlesInfo) => {
            //console.log(singlesInfo);

            if (singlesInfo.releases && singlesInfo.releases.length > 0) {
              const singles = singlesInfo.releases.map(
                (singles) => singles.title
              );
              //console.log(`Singles for ${artistInput}: ${singles.join(", ")}`);

              localStorage.setItem("singles", JSON.stringify(singles));
            } else {
              console.log(`No singles information for ${artistInput}`);
            }
          });
      }
    }
  }

  // Sorts genre data
  function compareGenres() {
    var primaryGenreArray = [];

    var compareInfo = localStorage.getItem("genres");
    var compareArray = JSON.parse(compareInfo);
    // console.log(`CompareInfo: ${compareArray}`);
    // console.log(compareArray);

    for (i = 0; i < compareArray.length; i++) {
      var splitInfo = compareArray[i].split(":");
      var key = splitInfo.shift(0);
      // console.log(`Key: ${key}`);
      var genreString = splitInfo;
      // console.log(`Genre String: ${genreString}`);
      // console.log(genreString);
      var genreArray = genreString[0].split(",");
      // console.log(`Genre array: ${genreArray}`);
      // console.log(genreArray);
      for (j = 0; j < genreArray.length; j++) {
        primaryGenreArray.push(genreArray[j]);
        //console.log(`Popular genres: ${popularGenres}`);
      }
    }

    //Object that contains each genre and the number of times it shows up
    const genreOccuranceAmount = {};

    //Counts how many times a genre shows up in primary genre array
    primaryGenreArray.forEach((genre) => {
      genreOccuranceAmount[genre] = (genreOccuranceAmount[genre] || 0) + 1;
    });
    console.log(genreOccuranceAmount);

    //Sorts the genres in descending order of appearance amount and takes the top 5
    var topGenres = Object.keys(genreOccuranceAmount)
      .sort((a, b) => genreOccuranceAmount[b] - genreOccuranceAmount[a])
      .slice(0, 5);
    console.log(topGenres);
    localStorage.setItem("topGenres", topGenres);
  }

  //fetches song metadata
  function fetchSongData(songInput, artistInput) {
    if (songInput) {
      const songDataUrl = `https://musicbrainz.org/ws/2/recording?query=${songInput}&artist=${artistInput}&limit=15&fmt=json`;

      fetch(songDataUrl)
        .then((response) => {
          if (response.ok === false) {
            throw Error(`Failed to fetch data: ${response.statusText}`);
          }
          return response.json();
        })
        .then((songData) => {
          console.log(songData);
        });
    }
  }

  //Add function to create list items based off of what we pull from the api for recommended music
  function displayRecommendations(data) {
    var recommendationsContainer = document.getElementById("lists-container");
    //Clear previous recs
    recommendationsContainer.innerHTML = "";

    data.tracks.forEach(function (track) {
      //create a div for each rec
      var recommendationItem = document.createElement("div");
      recommendationItem.className = "recommendation-item";
      recommendationItem.innerHTML = `<p>${track.name} by ${track.artists[0].name}</p>`;
      recommendationsContainer.appendChild(recommendationItem);
    });
  }
}

  // Add home button to go back to search page
  $("#homeButton").on("click", function () {
    window.location.href = "index.html";
  });
});