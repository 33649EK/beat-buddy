$(document).ready(function () {
  var getSongs = localStorage.getItem("singles");
  console.log(getSongs);
  var songTitles = getSongs.split(",");
  console.log(songTitles);

  function removeDuplicateSongs(data) {
    return [...new Set(data)];
  }
  var artistName = "Polyphia";
  var artistArea = "United States";
  var uniqueSongTitles = removeDuplicateSongs(songTitles);
  //   var artistLocation = [];
  //   var songList = document.getElementById("songList");
  $("#artistLocation").append(
    `<h2 class="artistInfoHeader">Artist: ${artistName}</h2><h2 class="artistInfoHeader">Location: ${artistArea}</h2>`
  );
  for (i = 0; i < uniqueSongTitles.length; i++) {
    $("#songList").append(
      `<li class='songListItems'>${uniqueSongTitles[i]}</li>`
    );
  }
});
