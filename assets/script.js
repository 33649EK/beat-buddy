

$('#submitButton').on('click', function () {
    var songInput = $('#songInput').val().trim();
    var artistInput = $('#artistInput').val().trim();
    console.log(songInput);
    console.log(artistInput);

    // Blocks to store, display and swap between the three saved user inputs
    // Look inside application and footer html in the console to see whats happening
    if ($(this).attr(`class`) === `dataOne`) {
    localStorage.songOne = (songInput)
    localStorage.artistOne = (artistInput) 
    var checkOne = localStorage.getItem("songOne")
    if (checkOne) {

    $(`#footer`).toggleClass(`hidden custom-label`)

    document.getElementById(`lastSearchSongOne`).innerHTML = localStorage.songOne 
    document.getElementById(`lastSearchArtistOne`).innerHTML = localStorage.artistOne }
    $(`#submitButton`).toggleClass(`dataOne dataTwo`)}

    else if ($(this).attr(`class`) === `dataTwo`) {
    localStorage.songTwo = (songInput)
    localStorage.artistTwo = (artistInput) 
    var checkTwo = localStorage.getItem("songTwo")
    if (checkTwo) {
    document.getElementById(`lastSearchSongTwo`).innerHTML = localStorage.songTwo 
    document.getElementById(`lastSearchArtistTwo`).innerHTML = localStorage.artistTwo }
    $(`#submitButton`).toggleClass(`dataTwo dataThree`)}

    else if ($(this).attr(`class`) === `dataThree`) {
    localStorage.songThree = (songInput)
    localStorage.artistThree = (artistInput) 
    var checkThree = localStorage.getItem("songThree")
    if (checkThree) {
    document.getElementById(`lastSearchSongThree`).innerHTML = localStorage.songThree 
    document.getElementById(`lastSearchArtistThree`).innerHTML = localStorage.artistThree }
    $(`#submitButton`).toggleClass(`dataThree dataOne`)}
});

// ## Current scaffold ##

// Add spotify API to read info stored in localstorage Data classes

// Expand .click event to bring up either new HTML or append the HTML to display an aside of reccomendations
// Feed API userdata to make a list of reccommended songs and or artists
// Depending on the information we can pull, create section for stats like "dancability" on searched terms

// Add home button to go back to search page

// Add an information API, like WIKI or another Song based, to display lyrics or information depending on the selected song or artist
// Add a backup for when artist or song has no additional information 