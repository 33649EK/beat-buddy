
$(document).ready(function () {
    numLog = [0]
    digit =[]
    function singleTick(numLog) {
        for (var i = 0; i < numLog.length; i++) {
            numLog[0] = numLog[0] + 1;
        }
       
        return numLog[0];
    }
    digit.push(numLog)
    console.log(numLog)
    
    
    // singleTick(numLog)
    $("#submitButton").on("click", function () {
        var songInput = $("#songInput").val().trim();
        var artistInput = $("#artistInput").val().trim();
        console.log(songInput);
        console.log(artistInput);
       
        singleTick(numLog);
     
        $(this).attr('class', `class${digit[0]}`);
     
        if ($(this).attr('class') === `class${digit[0]}`) {
          localStorage.setItem(`song${digit[0]}`, songInput);
          localStorage.setItem(`artist${digit[0]}`, artistInput);
         
          var checkStorageForData = localStorage.getItem(`song${digit[0]}`);
         
          if (checkStorageForData) {
            $(`#footer`).toggleClass(`hidden custom-label`);
            document.getElementById(`lastSearchSong${digit[0]}`).innerHTML =
              localStorage.getItem(`song${digit[0]}`);
            document.getElementById(`lastSearchArtist${digit[0]}`).innerHTML =
              localStorage.getItem(`artist${digit[0]}`);
            $(`#submitButton`).toggleClass(`data${digit[0]} data${digit[0] + 1}`);
          }
         
          console.log(numLog);
          fetchBrainz(artistInput);
        }
      });
    
    
    // Add Dynamic creation of Elements
    // Append these to new html document
    // on click of old searches rerun dynamic append to make it seem like there multiple pages
    



// Make the fetch request to MusicBrainz API
function fetchBrainz(artistInput) {
  const musicBrainzApiUrl = `https://musicbrainz.org/ws/2/artist/?query=${encodeURIComponent(
    artistInput
  )}&fmt=json`;
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

        // Now, fetch additional details including genres using the artist's MusicBrainz ID
        const artistDetailsUrl = `https://musicbrainz.org/ws/2/artist/${artistId}?inc=genres&fmt=json`;

        return fetch(artistDetailsUrl);
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
    .then((artistDetails) => {
      // Extract and log the genre information
      if (artistDetails.genres && artistDetails.genres.length > 0) {
        const genres = artistDetails.genres.map((genre) => genre.name);
        console.log(`Genres for ${artistInput}: ${genres.join(", ")}`);

        localStorage.setItem("genres",JSON.stringify(genres));
        window.location.href = "display.html";
      } else {
        console.log(`No genre information found for ${artistInput}`);
      }
    })
    .catch((error) => {
      console.error("Error during fetch:", error);
    });
}
// Expand .click event to bring up either new HTML or append the HTML to display an aside of reccomendations
// Feed API userdata to make a list of reccommended songs and or artists
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


// var artistInput = "Rick Astley";
// var songInput = `Never Gonna Give You Up`;
// var apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${artistInput}music${songInput}&maxResults=3&type=video&key=${keyYT}`;


// fetch(apiUrl)
//   .then((response) => response.json())
//   .then((data) => {
//     var videos = data.items;
//     videos.forEach((video) => {
//       var videoTitle = video.snippet.title;
//       var videoId = video.id.videoId;
//       var videoStorage = document.getElementById(`videoStorage`)
//       var createH3 = document.createElement(`h3`)
//       videoStorage.appendChild(createH3)
//       createH3.innerHTML =
//       `${videoTitle}<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
//     });
//   })
//   .catch((error) => console.error("Error fetching data:", error));
})




