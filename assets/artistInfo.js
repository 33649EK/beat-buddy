$(document).ready(function () {
  var getSongs = localStorage.getItem("singles");
  console.log(getSongs);
  var songTitles = getSongs.split(",");
  console.log(songTitles);

  function removeDuplicateSongs(data) {
    return [...new Set(data)];
  }

  var uniqueSongTitles = removeDuplicateSongs(songTitles);
  //   var artistLocation = [];
  //   var songList = document.getElementById("songList");
  $("#artistLocation").text("Location");
  for (i = 0; i < uniqueSongTitles.length; i++) {
    $("#songList").append(
      `<li class='songListItems'>${uniqueSongTitles[i]}</li>`
    );
  }
});
