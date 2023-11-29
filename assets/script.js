var keyYT = "AIzaSyCUOBNEgtTOeYGL0ECkHMvZf7lR4breL8g";
//var artistInput = "Rick Astley";
var songInput = `Never Gonna Give You Up`;
var apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${artistInput}music${songInput}&maxResults=3&type=video&key=${keyYT}`;

fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    var videos = data.items;
    videos.forEach((video) => {
      var videoTitle = video.snippet.title;
      var videoId = video.id.videoId;

      var video = document.getElementById(`video`);
      video.innerHTML = `
        ${videoTitle}
        <iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
    });
  })
  .catch((error) => console.error("Error fetching data:", error));

$("#submitButton").on("click", function () {
  var songInput = $("#songInput").val().trim();
  var artistInput = $("#artistInput").val().trim();
  console.log(songInput);
  console.log(artistInput);
  // Blocks to store, display and swap between the three saved user inputs
  // Look inside application and footer html in the console to see whats happening
  if ($(this).attr(`class`) === `dataOne`) {
    localStorage.songOne = songInput;
    localStorage.artistOne = artistInput;
    var checkOne = localStorage.getItem("songOne");
    if (checkOne) {
      $(`#footer`).toggleClass(`hidden custom-label`);

      document.getElementById(`lastSearchSongOne`).innerHTML =
        localStorage.songOne;
      document.getElementById(`lastSearchArtistOne`).innerHTML =
        localStorage.artistOne;
    }

    $(`#submitButton`).toggleClass(`dataOne dataTwo`);
  } else if ($(this).attr(`class`) === `dataTwo`) {
    localStorage.songTwo = songInput;
    localStorage.artistTwo = artistInput;
    var checkTwo = localStorage.getItem("songTwo");
    if (checkTwo) {
      document.getElementById(`lastSearchSongTwo`).innerHTML =
        localStorage.songTwo;
      document.getElementById(`lastSearchArtistTwo`).innerHTML =
        localStorage.artistTwo;
    }

    $(`#submitButton`).toggleClass(`dataTwo dataThree`);
  } else if ($(this).attr(`class`) === `dataThree`) {
    localStorage.songThree = songInput;
    localStorage.artistThree = artistInput;
    var checkThree = localStorage.getItem("songThree");
    if (checkThree) {
      document.getElementById(`lastSearchSongThree`).innerHTML =
        localStorage.songThree;
      document.getElementById(`lastSearchArtistThree`).innerHTML =
        localStorage.artistThree;
    }
    $(`#submitButton`).toggleClass(`dataThree dataOne`);
  }
  fetchBrainz(artistInput);
});

// ## Current scaffold ##

// Add spotify API to read info stored in localstorage Data classes

// Make the fetch request to MusicBrainz API
function fetchBrainz(artistInput) {
  const musicBrainzApiUrl = `https://musicbrainz.org/ws/2/artist/?query=${artistInput}&fmt=json&limit=5`;
  fetch(musicBrainzApiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      // Check if there are results
      if (data.artists && data.artists.length > 0) {
        const artist = data.artists[0]; // Assuming the first result is the most relevant
        const artistId = artist.id;
        fetchReleases(artistId);
        // Now, fetch additional details including genres using the artist's MusicBrainz ID
        const artistUrl = `https://musicbrainz.org/ws/2/artist/${artistId}?inc=genres&fmt=json`;
        return fetch(artistUrl);
      } else {
        throw new Error("No results found for the given artist name.");
      }
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      return response.json();
    })
    .then((artistGenres) => {
      console.log(artistGenres);
      // Extract and log the genre information
      if (artistGenres.genres && artistGenres.genres.length > 0) {
        const genres = artistGenres.genres.map((genre) => genre.name);
        console.log(`Genres for ${artistInput}: ${genres.join(", ")}`);
      } else {
        console.log(`No genre information found for ${artistInput}`);
      }
    })
    .catch((error) => {
      console.error("Error during fetch:", error);
    });

  //Fetch latest album releases from the user submitted artist
  function fetchReleases(artistId) {
    const releasesUrl = `https://musicbrainz.org/ws/2/release?artist=${artistId}&limit=30&inc=recordings&type=album&fmt=json`;
    fetch(releasesUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.statusText}`
          );
        }
        return response.json();
      })
      .then((releaseInfo) => {
        console.log(releaseInfo);
        console.log(releaseInfo.releases.title);
      });
  }

  fetchSongData();
}

function fetchSongData() {}
// Add additional api calls to grab artist/song type, release date, country, potential event information.

// Feed API userdata to make a list of recommended songs and or artists
// Depending on the information we can pull, create section for stats like "dancability" on searched terms
//Add function to create list items based off of what we pull from the api for recommended music
function displayRecommendations(data) {
  var recommendationsContainer = document.getElementById("lists-container");
  //Clear previous recs
  recommendationsContainer.innerHTML = "";

  data.tracks.forEach(function (track) {
    //create a div for each rec
    var recommendationItem = document.createElement("div");
    recommendationItem.className = "recommendation-item";
    recommendationItem.innerHTML =
      "<p>" + track.name + " by " + track.artists[0].name + "<p>";
    recommendationsContainer.appendChild(recommendationItem);
  });
}
// Add home button to go back to search page
document.getElementById("homeButton").addEventListener("click", function () {
  window.location.href = "index.html";
});
// Add an information API, like WIKI or another Song based, to display lyrics or information depending on the selected song or artist
// Add a backup for when artist or song has no additional information
