

/* FETCH FUNCTIONS */
const MusicDatabase = {


    /* SEARCH */
    /* Search Title */
searchTitle(term){
    return fetch(`https://deezerdevs-deezer.p.rapidapi.com/search?q=${term}`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
            "x-rapidapi-key": "bfc9cb153bmsh393eabf1bccbe91p1e3a3fjsn0e373ab683ce"
        }
    }).then(response => {
        return response.json();
    })
},
/* Search Playlist */
searchPlayList(id){
    return fetch(`https://deezerdevs-deezer.p.rapidapi.com/playlist/${id}`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
            "x-rapidapi-key": "bfc9cb153bmsh393eabf1bccbe91p1e3a3fjsn0e373ab683ce"
        }
    }).then(response => {
        return response.json();
    })
},

/* Search Album */
searchAlbum(albumId){
    return fetch(`https://deezerdevs-deezer.p.rapidapi.com/album/${albumId}`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
            "x-rapidapi-key": "bfc9cb153bmsh393eabf1bccbe91p1e3a3fjsn0e373ab683ce"
        }
    }).then(response => {
        return response.json();
    })
},

     /* SEARCH MORE */


/* Search More Titles */
searchMoreTitles(term, num){
    return fetch(`https://deezerdevs-deezer.p.rapidapi.com/search?q=${term}&index=${num}`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
            "x-rapidapi-key": "bfc9cb153bmsh393eabf1bccbe91p1e3a3fjsn0e373ab683ce"
        }
    }).then(response => {
        return response.json();
    })
},

/* Search More Tracklist Tracks */
searchMoreTrackList(id, num){
    return fetch(`https://deezerdevs-deezer.p.rapidapi.com/search?q=${id}&index=${num}`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
            "x-rapidapi-key": "bfc9cb153bmsh393eabf1bccbe91p1e3a3fjsn0e373ab683ce"
        }
    }).then(response => {
        return response.json();
    })
},
}

export default MusicDatabase;







