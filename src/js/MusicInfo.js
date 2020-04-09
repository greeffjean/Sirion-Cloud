import React from 'react';
/* Stylesheets */
import '../css/MusicInfo.scss';
import '../css/MusicInfoResponsive.scss';
/* Components */
import MusicItem from './MusicItem';
import MusicDatabase from './MuiscDatabase';
import AlbumPortal from './AlbumPortal';
import TrackListPortal from './TrackListPortal';
/* Misc */
import logo from '../media/logo.png';




class MusicInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      /*apply browser styling*/
      browser: this.getBrowser(),
      /* music lists */
      musicList: [],
      favouritesMusicList: [],
      /*componenet active states*/
      musicInfoGenre: "active",
      musicInfoAlbum: [],
      musicInfoTracklist: [],
      /*info variables*/
      currentAlbumInfo: [],
      currentSearchInfo: [],
      /* track identification variables */
      currentMusicItems: [],
      favourites: [],
      /*DOM styling conditions*/
      renderSearch: "false",
      skipDeactivate: "false",
      syncPlayAudio: [],
      audioplayerStyle: {
        audioPlayer: { background: "hsl(200, 12%, 95%)" },
        audioPlayerTitlesFirst: { color: "coral" },
        audioPlayerTitlesSecond: { color: "grey" },
      },
      audioSkip: { color: "grey", pointerEvents: "none" },
      /*miscellaneous*/
      currentGenre: [],
      name: [],
      typingTimeout: 0,
      errorMessage: [],
    }
    /*DOM refs*/
    this.musicContainerRef = React.createRef();
    this.inputRef = React.createRef();
  }






  /* HOME STATE LIST */
  /* SEARCH*/
  /* Input Search Part1  */
  changeName(event) {
    /*( on render always start at top )*/
    this.musicContainerRef.current.scrollTo(0, 0);
    /*(trigger load)*/
    this.triggerLoad()
    /*(disable components)*/
    this.albumDisable();
    this.tracklistDisable();
    /*( empty input dont run function )*/
    var term = this.state.name;
    if (event.target.value === '') {
      this.setState({
        searchTimeoutDisable: true
      })
      this.searchPlayList(this.state.currentGenre)
      return
    }

    /*( set state changes )*/
    else {
      this.setState({
        trackCanPlay: [],
        favouritesActive: "false",
        albumReady: "false",
        changeComponentActive: "false",
        renderSearch: "true",
        skipDeactivate: "true",
        errorMessage: [],
        searchTimeoutDisable: false,
        audioSkip: this.state.audioSkipHide,
        musicInfoGenre: "active",
        musicInfoAlbum: [],
        musicInfoTracklist: [],
      })


      /*( call search render smoothly )*/
      const self = this;
      if (self.state.typingTimeout) {
        clearTimeout(self.state.typingTimeout);
      }
      self.setState({
        musicList: [],
        name: event.target.value,
        typingTimeout: setTimeout(function () {
          if (term !== '') {
            self.searchMusic(self.state.name);
          }
        }, 2000)
      });
    }
  }

  /* Input Search Part2 */
  searchMusic(term) {
    /*( fetch )*/
    var newList = [];
    MusicDatabase.searchTitle(term).then(response => {
      /*( fetch - check for error )*/
      if (response.data.length === 0) {
        this.state.errorMessage = "nothing found";
        this.errorMessage()
      }
      /*( fetch - filter redundant data )*/
      response.data.map(value => {
        if (value.preview != "") {
          newList.push(value)
        }
      })
      /*( fetch - apoint new data - if search_timout is not disabled )*/
      if (this.state.searchTimeoutDisable === true && this.state.name.length < 2) {
        return
      }
      else {
        this.setState({
          musicList: newList,
        })
      }
      /*( add more tracks to the render )*/
      this.renderMoreSearch()
    })
  }

  /* Change To Genre PlayList */
  searchPlayList(id) {
    /*( on render always start at top )*/
    this.musicContainerRef.current.scrollTo(0, 0);
    /*(trigger load)*/
    this.triggerLoad();
    /*(disable components)*/
    this.albumDisable();
    this.tracklistDisable();
    /*( empty search field )*/
    this.inputRef.current.value = '';
    /*( set state changes )*/
    /*( fetch )*/
    var newList = [];
    MusicDatabase.searchPlayList(id).then(response => {
      response.tracks.data.map(value => {
        if (value.preview != "" && value.readable != false) {
          newList.push(value)
        }
      })
      /*( apoint data )*/
      this.setState({
        musicList: newList,
        changeComponentActive: "false",
        currentGenre: response.id,
        musicInfoGenre: "active",
        musicInfoAlbum: [],
        musicInfoTracklist: [],
        skipDeactivate: "true",
        favouritesActive: "false",
        renderSearch: "false",
        errorMessage: [],
        audioSkip: this.state.audioSkipHide,
      })
    })
  }

  /* Render More Input Search */
  renderMoreSearch() {
    var moreMusic = this.state.musicList;
    /*( fetch)*/
    MusicDatabase.searchMoreTitles(this.state.name, this.state.musicList.length + 25).then(response => {
      response.data.map(value => {
        if (value.preview != "") {
          moreMusic.push(value)
        }
      });
    })
    /*( remove duplicate values)*/
    var singleValuesArr = moreMusic;
    const uniqueList = Array.from(new Set(singleValuesArr.map(a => a.id))).map(id => {
      return singleValuesArr.find(a => a.id === id)
    })
    moreMusic = uniqueList
    /*( apoint new data )*/
    this.setState({
      musicList: moreMusic,
    })
  }


  /* ALBUM */
  /* Change To Album */
  changeToAlbum(id) {
    /*( on render always start at top )*/
    this.musicContainerRef.current.scrollTo(0, 0);
    /*(trigger load)*/
    this.triggerLoad();
    /*(disable components)*/
    this.tracklistDisable();
    /*( empty search field )*/
    this.inputRef.current.value = '';
    /*( fetch )*/
    var albumList = [];
    MusicDatabase.searchAlbum(id).then(response => {
      response.tracks.data.map(value => {
        if (value.preview != "" && value.readable != false) {
          albumList.push(value)
        }
      })
      /*( smooth functioning )*/
      setTimeout(function () { }, 1000)
      this.setState({
        albumReady: "true",
        musicInfoGenre: [],
        musicInfoAlbum: "active",
        musicInfoTracklist: [],
        renderSearch: "false",
        errorMessage: [],
        pauseTracklistListener: "false",
        audioSkip: this.state.audioSkipHide,
        changeComponentActive: "true",
        skipDeactivate: "true",
        favouritesActive: "false",
        currentAlbumInfo: response,
        musicList: albumList,
        artistId: response.artist.id
      })
    })
  }

  /*disable album render*/
  albumDisable() {
    this.setState({
      albumReady: [],
    })
  }



  /* PLAYLIST */
  /* Change To Tracklist */
  changeToTrackList(name) {
    /*( on render always start at top )*/
    this.musicContainerRef.current.scrollTo(0, 0);
    /*(trigger load)*/
    this.triggerLoad();
    /*(disable components)*/
    this.albumDisable();
    /*( fetch )*/
    var artistTrackList = [];
    MusicDatabase.searchTitle(name).then(response => {
      response.data.map(value => {
        if (value.preview != "" && value.readable != false) {
          artistTrackList.push(value)
        }
      })
      /*( set State changes )*/
      this.setState({
        changeComponentActive: "true",
        skipDeactivate: "true",
        audioSkip: this.state.audioSkipHide,
        favouritesActive: "false",
        musicList: artistTrackList,
        artistTrackList: response,
        trackListReady: "true",
        musicInfoGenre: [],
        musicInfoAlbum: [],
        musicInfoTracklist: "active",
        renderSearch: "false",
        errorMessage: [],
        pauseTracklistListener: "false",
        playlistReturnData: name,
      })
    })
  }

  /* Render More Playlist Tracks */
  moreTracksTrackList(name) {
    var artistTrackList = this.state.artistTrackList.data;
    /*( fetch )*/
    MusicDatabase.searchMoreTrackList(name, this.state.musicList.length + 25).then(response => {
      response.data.map(value => {
        if (value.preview != "") {
          artistTrackList.push(value)
        }
      })
      /*( remove duplicate values)*/
      var singleValuesArr = artistTrackList;
      const uniqueList = Array.from(new Set(singleValuesArr.map(a => a.id))).map(id => {
        return singleValuesArr.find(a => a.id === id)
      })
      artistTrackList = uniqueList

      /*( apoint new data )*/
      this.setState({
        musicList: artistTrackList,
      })
    })
  }

  /*disable tracklist render*/
  tracklistDisable() {
    this.setState({
      trackListReady: [],
    })
  }



  /* FAVOURITES */
  /* Change State To Favourites */
  changeToFavourites() {
    /* (return empty fuction if list is un-populated) */
    if (this.state.favouritesMusicList.length == 0) {
      console.log("empty")
      return
    }
    else {
      /* (start at top) */
      this.musicContainerRef.current.scrollTo(0, 0);
      /*(disable components)*/
      this.albumDisable();
      this.tracklistDisable();
      /*(empty input field)*/
      this.inputRef.current.value = '';
      /*(trigger load)*/
      this.triggerLoad();
      /*( set state changes )*/
      this.setState({
        musicList: this.state.favouritesMusicList,
        changeComponentActive: "false",
        skipDeactivate: "true",
        favouritesActive: "true",
        errorMessage: [],
        audioSkip: this.state.audioSkipHide,
        musicInfoGenre: "active",
        musicInfoAlbum: [],
        musicInfoTracklist: [],
      })
    }
  }

  /* Adds and Removes Items */
  addFavourites(value) {
    /* (favourite variables) */
    var checkPlay = this.state.checkPlay;
    var musicList = this.state.musicList;
    var checkForEmptyList = this.state.musicId;
    var favourites = this.state.favourites;
    var favouritesMusicList = this.state.favouritesMusicList;
    var condition = [];
    var index = [];
    var favouritesActive = this.state.favouritesActive;

    /*( Filtering Out Duplicates )*/
    /*( finding duplicates )*/
    if (favourites.length > 0) {
      favourites.map(val => {
        if (val === value.id) {
          condition = "false"
          index.push(favourites.indexOf(val));
          if (val === this.state.musicId) {
            checkPlay = "empty"
          }
        }
      })
    }
    /*( filtering duplicates )*/
    if (condition == "false") {
      var filteredArray = favourites.filter(function (x) {
        return x !== value.id;
      });
      var filterArrayMusicList = favouritesMusicList.filter(function (x) {
        return x.id !== value.id;
      });
      favourites = filteredArray;
      favouritesMusicList = filterArrayMusicList;
    }
    /*( Add if no duplicates exist )*/
    else if (condition != "false" && favourites.length >= 0) {
      favourites.push(value.id)
      favouritesMusicList.push(value);
    }
    /*( apoint new data to variable )*/
    if (favouritesActive === "true") {
      musicList = filterArrayMusicList;
    }
    /*( Favourite list is empty function )*/
    if (this.state.favouritesActive === "true" && favouritesMusicList.length === 0) {
      this.emptyFavourites()
      this.searchPlayList(this.state.currentGenre)
      checkForEmptyList = [];
      checkPlay = "empty";
    }
    /*( apoint new State data )*/
    this.setState({
      favourites: favourites,
      favouritesMusicList: favouritesMusicList,
      musicId: checkForEmptyList, /* if favourite track plays and list gets emptied will the musicId = [] */
      musicList: musicList,
      checkPlay: checkPlay
    })
    /*( reset condition )*/
    condition = [];
  }

  /* Empty Favourites */
  emptyFavourites() {
    this.setState({
      musicItemPlay: [],
      favourites: [],
      favouritesMusicList: [],
      trackCanPlay: "false",
      checkPlay: [],
      checkPause: [],
    })
  }


  /* MUSIC PLAYBACK */
  /*  Play Track Home State */
  playSong(track, album, title, albumArt, id) {
    console.log(albumArt)
    var checkPlay = this.state.checkPlay;
    var checkPause = this.state.checkPause;
    /*( find exisitng playing tracks in the DOM and apply styling )*/
    if (track === this.state.syncPlayAudio) {
      checkPlay = "true";
      checkPause = "false";
    }
    else {
      checkPlay = "false";
      checkPause = "true";
    }

    /*( play song and appoint track data )*/
    this.setState({
      checkPlay: checkPlay,
      checkPause: checkPause,
      trackCanPlay: [],
      musicItemPlay: track,
      musicItemTitle: title,
      musicItemAlbum: album,
      musicItemAlbumArt: albumArt,
      musicId: id,
      skipActive: "false",
      changeComponentActive: "false",
    })
    /*( audio player play )*/
    var audioplayer = document.getElementById("audio");
    audioplayer.play();
  }


  /*  Play Album Track */
  playAlbumTrack(value, assets) {
    var checkPlay = this.state.checkPlay;
    var checkPause = this.state.checkPause;
    /*( find exisitng playing tracks in the DOM and apply styling )*/
    if (value.preview === this.state.syncPlayAudio) {
      checkPlay = "true";
      checkPause = "false";
    }
    /*( find exisitng playing tracks in the DOM and apply styling )*/
    if (value.preview !== this.state.syncPlayAudio) {
      checkPlay = "false";
      checkPause = "true";
    }
    /*( set State changes )*/
    this.setState({
      checkPlay: checkPlay,
      checkPause: checkPause,
      musicItemPlay: value.preview,
      musicId: value.id,
      musicItemTitle: value.title,
      musicItemAlbumArt: assets.cover_small,
      musicItemAlbum: value.artist.name,
      changeComponentActive: "true",
      tracklistTrackActive: 'false',
      skipDeactivate: "false",
    })
    /*( audio player play )*/
    var audioplayer = document.getElementById("audio");
    audioplayer.play();
  }

  /*  Play TrackList Track */
  playTrackListTrack(value) {
    var checkPlay = this.state.checkPlay;
    var checkPause = this.state.checkPause;
    /*( find exisitng playing tracks in the DOM and apply styling )*/
    if (value.preview === this.state.syncPlayAudio) {
      checkPlay = "true";
      checkPause = "false";
    }
    /*( find exisitng playing tracks in the DOM and apply styling )*/
    if (value.preview !== this.state.syncPlayAudio) {
      checkPlay = "false";
      checkPause = "true";
    }
    /*(set state changes)*/
    this.setState({
      checkPlay: checkPlay,
      checkPause: checkPause,
      musicItemPlay: value.preview,
      musicId: value.id,
      musicItemTitle: value.title,
      musicItemAlbum: value.album.title,
      musicItemAlbumArt: value.album.cover_small,
      changeComponentActive: "true",
      tracklistTrackActive: 'true',
      skipDeactivate: "false",
    })
    /*( audio player play )*/
    var audioplayer = document.getElementById("audio");
    audioplayer.play();
  }

  /* On Can Play */
  onCanPlay() {
    /*( set State changes )*/
    this.setState({
      trackCanPlay: "true",
      checkPlay: "true",
      checkPause: "false",
      syncPlayAudio: this.state.musicItemPlay,
    })
  }

  /* On Play */
  onPlay() {
    var audioSkipActive = this.state.audioSkipActive.color;
    /*( sync playback - DOM styling )*/
    if (this.state.musicItemPlay === this.state.syncPlayAudio) {
      this.setState({
        checkPlay: "true",
        checkPause: "false",
        audioSkip: { color: `${audioSkipActive}` },
      })
    }
  }

  /* Pause Function Onclick Music Item Box */
  pauseSong() {
    /*(audio player)*/
    var audioplayer = document.getElementById("audio");
    audioplayer.pause();
    /*( set state changes - incl plaback DOM sync)*/
    this.setState({
      checkPlay: "false",
      checkPause: "true",
      pauseTracklistListener: "true",
    })
  }

  /* Standard On Pause (sync audio player button and active musiclist item button) */
  pauseSync(e) {
    this.setState({
      checkPause: "true",
      checkPlay: "false",
    })
  }

  /* Skip Forward Audio Player */
  skipForward() {
    /*( check for maximum skips limit )*/
    var maxSkip = this.state.musicList.length - 1;
    var checkPause = this.state.checkPause;
    var checkPlay = this.state.checkPlay;
    var pauseTracklistListener = this.state.pauseTracklistListener;
    if (this.state.musicId === this.state.musicList[maxSkip].id) {
      checkPause = "false";
      checkPlay = "true";
      pauseTracklistListener = "false";
      return
    }
    else {
      /*( set State - ensure DOM styling changes when track plays)*/
      checkPause = "true";
      checkPlay = "false";
      skipActive = "false";
      pauseTracklistListener = "false";
      /* (findng a match) */
      var musicList = this.state.musicList;
      var currentItem = this.state.musicId;
      var currentIndex = [];
      musicList.map(value => {
        if (value.id === currentItem) {
          var index = musicList.indexOf(value);
          currentIndex.push(index);
        }
      })
      /* (get raw value) */
      var removeArr = currentIndex++;
      var nextIndex = removeArr + 1;
      var nextMusicItemInfo = [];
      /* (search for matching data) */
      musicList.map(value => {
        if (musicList.indexOf(value) === nextIndex) {
          nextMusicItemInfo.push(value)
        }
      })
      /* (pass approriate data to variables) */
      var musicItemAlbumArt = this.state.musicItemAlbumArt;
      var musicItemPlay = this.state.musicItemPlay;
      var musicItemTitle = this.state.musicItemTitle;
      var musicItemAlbum = this.state.musicItemAlbum;
      var musicId = this.state.musicId;
      var skipActive = this.state.skipActive;
      /*(tracklist skip state)*/
      if (this.state.changeComponentActive === "true" && this.state.tracklistTrackActive === 'true') {
        musicItemAlbumArt = nextMusicItemInfo[0].album.cover_small;
        musicItemPlay = nextMusicItemInfo[0].preview;
        musicItemTitle = nextMusicItemInfo[0].title;
        musicItemAlbum = nextMusicItemInfo[0].album.title;
        musicId = nextMusicItemInfo[0].id;
        skipActive = "true";
      }

      /*(album skip state)*/
      else if (this.state.changeComponentActive === "true") {
        musicItemPlay = nextMusicItemInfo[0].preview;
        musicItemTitle = nextMusicItemInfo[0].title;
        musicItemAlbum = nextMusicItemInfo[0].artist.name;
        musicId = nextMusicItemInfo[0].id;
        skipActive = "true";
      }

      /*(defualt state)*/
      else {
        musicItemAlbumArt = nextMusicItemInfo[0].album.cover_small;
        musicItemPlay = nextMusicItemInfo[0].preview;
        musicItemTitle = nextMusicItemInfo[0].title;
        musicItemAlbum = nextMusicItemInfo[0].album.title;
        musicId = nextMusicItemInfo[0].id;
        skipActive = "true";
      }
    }
    /* (apoint new data) */
    this.setState({
      checkPause: checkPause,
      checkPlay: checkPlay,
      pauseTracklistListener: pauseTracklistListener,
      skipActive: skipActive,
      musicItemAlbumArt: musicItemAlbumArt,
      musicItemPlay: musicItemPlay,
      musicItemTitle: musicItemTitle,
      musicItemAlbum: musicItemAlbum,
      musicId: musicId,
    })
  }

  /* Skip Backward Audio Player */
  skipBackward() {
    var checkPause = this.state.checkPause;
    var checkPlay = this.state.checkPlay;
    var pauseTracklistListener = this.state.pauseTracklistListener;
    /*( check for maximum skips limit )*/
    if (this.state.musicId === this.state.musicList[0].id) {
      checkPause = "false";
      checkPlay = "true";
      pauseTracklistListener = "false";
      return
    }

    /*( set State - ensure DOM styling changes when track plays)*/
    else {
      checkPause = "true";
      checkPlay = "false";
      skipActive = "false";
      pauseTracklistListener = "false";
      var musicList = this.state.musicList;
      var currentItem = this.state.musicId;
      var currentIndex = [];
      /* (finding a match) */
      musicList.map(value => {
        if (value.id === currentItem) {
          var index = musicList.indexOf(value);
          currentIndex.push(index);
        }
      })
      /* (get raw value) */
      var removeArr = currentIndex++;
      var nextIndex = removeArr - 1;
      /* (find matching data) */
      var nextMusicItemInfo = [];
      musicList.map(value => {
        if (musicList.indexOf(value) === nextIndex) {
          nextMusicItemInfo.push(value)
        }
      })
      /* (pass approriate data to variables) */
      var musicItemalbumArt = this.state.musicItemalbumArt;
      var musicItemPlay = this.state.musicItemPlay;
      var musicItemtitle = this.state.musicItemtitle;
      var musicItemalbum = this.state.musicItemalbum;
      var musicId = this.state.musicId;
      var skipActive = this.state.skipActive;
      /*(tracklist skip state)*/
      if (this.state.changeComponentActive === "true" && this.state.tracklistTrackActive === 'true') {
        musicItemalbumArt = nextMusicItemInfo[0].album.cover_small;
        musicItemPlay = nextMusicItemInfo[0].preview;
        musicItemtitle = nextMusicItemInfo[0].title;
        musicItemalbum = nextMusicItemInfo[0].album.title;
        musicId = nextMusicItemInfo[0].id;
        skipActive = "true";
      }

      /*(album skip state)*/
      else if (this.state.changeComponentActive === "true") {
        musicItemPlay = nextMusicItemInfo[0].preview;
        musicItemtitle = nextMusicItemInfo[0].title;
        musicItemalbum = nextMusicItemInfo[0].artist.name;
        musicId = nextMusicItemInfo[0].id;
        skipActive = "true";
      }

      /*(defualt state)*/
      else {
        musicItemalbumArt = nextMusicItemInfo[0].album.cover_small;
        musicItemPlay = nextMusicItemInfo[0].preview;
        musicItemtitle = nextMusicItemInfo[0].title;
        musicItemalbum = nextMusicItemInfo[0].album.title;
        musicId = nextMusicItemInfo[0].id;
        skipActive = "true";
      }
    }
    /* (apoint new data) */
    this.setState({
      checkPause: checkPause,
      checkPlay: checkPlay,
      pauseTracklistListener: pauseTracklistListener,
      skipActive: skipActive,
      musicItemalbumArt: musicItemalbumArt,
      musicItemPlay: musicItemPlay,
      musicItemtitle: musicItemtitle,
      musicItemalbum: musicItemalbum,
      musicId: musicId,
    })
  }

  /* Reset Play/Pause */
  reset() {
    this.setState({
      skipActive: "false"
    })
  }

  /* MISC */
  /* Trigger Loading Animation */
  triggerLoad() {
    this.setState({
      musicList: []
    })
  }

  /* Errors */
  onError() {
    this.setState({
      trackCanPlay: "false"
    })
  }

  /* Error Mesage */
  errorMessage() {
    this.setState({
      musicInfoGenre: [],
      musicInfoAlbum: [],
      musicInfoTracklist: [],
    })
  }

  /* AUDIO PLAYER STYLING FOR BROWSERS */
  /* determine browser */
  getBrowser() {
    if (navigator.userAgent.indexOf("Chrome") != -1) {
      return "Chrome";
    } else if (navigator.userAgent.indexOf("Opera") != -1) {
      return "Opera";
    } else if (navigator.userAgent.indexOf("MSIE") != -1) {
      return "Internet Explorer";
    } else if (navigator.userAgent.indexOf("Firefox") != -1) {
      return "Firefox";
    }
    else if (navigator.userAgent.indexOf("Safari") != -1) {
      return "Safari";
    }
  }

  setBrowserAudioPlayerStyle() {
    var audioPlayer = [];
    var audioSkip = [];
    var audioSkipHide = [];
    var audioPlayerTitlesFirst = [];
    var audioPlayerTitlesSecond = [];
    if (this.state.browser == 'Chrome' || 'Opera') {
      audioPlayer.push("hsl(200, 12%, 95%)");
      audioSkip.push("grey");
      audioSkipHide.push("lightgrey")
      audioPlayerTitlesFirst.push("coral");
      audioPlayerTitlesSecond.push("grey");
    }
    if (this.state.browser == 'Firefox') {
      audioPlayer.push("hsl(0, 0%, 13%)");
      audioSkip.push("white");
      audioSkipHide.push("lightgrey")
      audioPlayerTitlesFirst.push("lightgrey");
      audioPlayerTitlesSecond.push("white");
    }
    if (this.state.browser == 'Safari') {
      audioPlayer.push("hsl(180, 1%, 24%)");
      audioSkip.push("white");
      audioSkipHide.push("lightgrey")
      audioPlayerTitlesFirst.push("lightgrey");
      audioPlayerTitlesSecond.push("white");
    }
    if (this.state.browser == 'MSIE') {
      audioPlayer.push("black");
      audioSkip.push("white");
      audioSkipHide.push("lightgrey")
      audioPlayerTitlesFirst.push("lightgrey");
      audioPlayerTitlesSecond.push("white");
    }
    this.setState({
      audioplayerStyle: {
        audioPlayer: { background: `${audioPlayer}` },
        audioPlayerTitlesFirst: { color: `${audioPlayerTitlesFirst}` },
        audioPlayerTitlesSecond: { color: `${audioPlayerTitlesSecond}` },
      },
      audioSkipHide: { color: `${audioSkipHide}`, pointerEvents: "none" },
      audioSkipActive: { color: `${audioSkip}` },
      audioSkip: { color: `${audioSkipHide}`, pointerEvents: "none" },
    })
  }




  /* RENDER */
  render() {

    /* search input error message */
    var errorMessage = [];
    if (this.state.errorMessage === "nothing found") {
      errorMessage.push(<p className="errorMessage">NOTHING FOUND...</p>)
    }
    else {
      errorMessage = []
    }

    /* PUSH AVAILABLE DATA INTO DOM */
    var genreItems = [];
    if (typeof this.state.musicList != 'undefined' && this.state.changeComponentActive != "true") {
      if (this.state.musicList.length > 0) {
        this.state.musicList.map(value => {

          /* check for favourites and apply styling */
          var favouriteStyling = [];
          this.state.favourites.map(val => {
            if (val == value.id) {
              favouriteStyling = "true"
            }
          })

          /* create new list */
          if (value.preview !== "" && value.readable !== false) {
            genreItems.push(< MusicItem
              /*PlayBack*/
              checkPlay={this.state.checkPlay}
              checkPause={this.state.checkPause}
              /*Functions*/
              pauseSong={(e) => this.pauseSong(e)}
              playSong={(track, album, title, albumArt, id) => this.playSong(track, album, title, albumArt, id)}
              changeToAlbum={(id) => this.changeToAlbum(id)}
              addFavourites={(val) => this.addFavourites(val)}
              /*Info*/
              info={value}
              key={value.id}
              selector={value.id}
              musicId={this.state.musicId}
              skipActive={this.state.skipActive}
              favouriteStyling={favouriteStyling}
            />)
          }
          favouriteStyling = [];
        })
      }
    }


    /* push available album information into DOM - create new list  */
    var albumPortal = [];
    if (this.state.albumReady === 'true') {
      albumPortal.push(< AlbumPortal
        /*PlayBack*/
        checkPause={this.state.checkPause}
        checkPlay={this.state.checkPlay}
        /*Functions*/
        playTrack={(value, assets) => this.playAlbumTrack(value, assets)}
        changeToTrackList={(e) => this.changeToTrackList(e)}
        addFavourite={(val) => this.addFavourites(val)}
        resetState={(e) => this.resetState(e)}
        pauseTrack={(e) => this.pauseSong(e)}
        /*Info*/
        albumReady={this.state.albumReady}
        key={this.state.currentAlbumInfo.id}
        albumInfo={this.state.currentAlbumInfo}
        musicId={this.state.musicId}
        favouriteLog={this.state.favourites}
        currentMusicItemTitle={this.state.musicItemTitle}

      />)
    }


    /* push available tracklist information into DOM - create new list  */
    var track_list = [];
    if (this.state.trackListReady === "true") {
      track_list.push(< TrackListPortal
        /*PlayBack*/
        checkPause={this.state.checkPause}
        checkPlay={this.state.checkPlay}
        /*Functions*/
        pauseTrack={(e) => this.pauseSong(e)}
        playTrackListTrack={(value, albumArt, artist, album, title) => this.playTrackListTrack(value, albumArt, artist, album, title)}
        moreTracks={(e) => this.moreTracksTrackList(e)}
        addFavourite={(val) => this.addFavourites(val)}
        changeToAlbum={(id, back_option) => this.changeToAlbum(id, back_option)}
        /*Info*/
        key={this.state.artistId} 
        trackListInfo={this.state.artistTrackList}   
        trackListArtist={this.state.musicList}
        musicId={this.state.musicId}
        trackListReady={this.state.trackListReady}  
        favouriteLog={this.state.favourites}  
        albumChangeBack={this.state.currentAlbumInfo}
        currentMusicItemTitle={this.state.musicItemTitle}
      />)
    }


    return (
      <div className="main_wrapper">

        {/* top bar (dark) */}
        <div className="top_wrapper">
          <div className='top_wrapper_param'>
            <div className="logo"> <img src={logo}></img>  <h2>SirionCloud</h2> </div>
            <div className="search_bar"> <input ref={this.inputRef} className="input" onChange={(val) => this.changeName(val)} spellCheck="false" placeholder="Search" ></input>
              <i className="fa fa-bars"></i>
            </div>
          </div>
        </div>

        {/* bottom section */}
        <div className="bottom_wrapper">
          <div className="main_wrapper_container">
            <div className="main_wrapper">

              {/* genre bar  */}
              <div className="genre_bar">
                <div className='genre_bar_param'>
                  <div className="genre_item" onClick={(e) => this.searchPlayList(3220851222)} > Brazilian <div className="genre_bar_item_border"></div> </div>
                  <div className="genre_item" onClick={(e) => this.searchPlayList(1615514485)} > Jazz <div className="genre_bar_item_border"></div> </div>
                  <div className="genre_item" onClick={(e) => this.searchPlayList(735488796)} > Indie <div className="genre_bar_item_border"></div> </div>
                  <div className="genre_item" onClick={(e) => this.searchPlayList(1767932902)} > Blues <div className="genre_bar_item_border"></div> </div>
                  <div className="genre_item" onClick={(e) => this.searchPlayList(4485213484)} > Soul <div className="genre_bar_item_border"></div> </div>
                  <div className="genre_item" onClick={(e) => this.searchPlayList(2113355604)} > Dance <div className="genre_bar_item_border"></div> </div>
                  <div className="genre_item" onClick={(e) => this.searchPlayList(1283464975)} > Pop <div className="genre_bar_item_border"></div> </div>
                  <div className="genre_item" onClick={(e) => this.searchPlayList(3801761042)} > Electronic <div className="genre_bar_item_border"></div> </div>
                  <div className={this.state.favourites.length != 0 ? "genre_item_heart active" : "genre_item_heart"}
                    onClick={(e) => this.changeToFavourites(e)} > <i className="fa fa-heart"></i>
                    <div className="genre_bar_item_border"></div>
                  </div>
                </div>
              </div>


              {/* information display area */}
              <div ref={this.musicContainerRef} className='music_info_container'>

                {/* loader */}
                <div className={this.state.musicList.length > 0 || this.state.errorMessage === "nothing found" ? "loader disable" : "loader"}>
                  <div className="example">
                    <div className="sk-wave">
                      <div className="sk-wave-rect"></div>
                      <div className="sk-wave-rect"></div>
                      <div className="sk-wave-rect"></div>
                      <div className="sk-wave-rect"></div>
                      <div className="sk-wave-rect"></div>
                    </div>
                  </div>
                </div>
                {/* error  */}
                {errorMessage}


                {/* render area for genre items */}
                <div className={this.state.musicInfoGenre == "active" ? "music_info_genre" : "music_info_genre disable"}>
                  {genreItems}
                  <div className={this.state.renderSearch === "true" && this.state.favouritesActive != "true" ? "spacer_genre active" : "spacer_genre"}>
                    <p onClick={(e) => this.renderMoreSearch(e)}>+</p>
                  </div>
                </div>

                {/* render area for album items  */}
                <div className={this.state.musicInfoAlbum == "active" ? "music_info_album enable" : "music_info_album"}>
                  {albumPortal}
                </div>

                {/* render area for tracklist items  */}
                <div className={this.state.musicInfoTracklist == "active" ? "music_info_tracklist enable" : "music_info_tracklist"}>
                  {track_list}
                </div>

              </div>

              {/* audio player */}
              <div className={typeof this.state.checkPlay != "undefined" && this.state.checkPlay != "empty" ? "audio_player active" : "audio_player"} style={this.state.audioplayerStyle.audioPlayer}>
                <div className="audio_info">
                  <img src={`${this.state.musicItemAlbumArt}`}></img>
                  <div className="audio_player_titles" >
                    <p className="first" style={this.state.audioplayerStyle.audioPlayerTitlesFirst}>{this.state.musicItemTitle}</p>
                    <p className="second" style={this.state.audioplayerStyle.audioPlayerTitlesSecond} >{this.state.musicItemAlbum}</p>
                  </div>
                </div>
                <div className="audio_skip" style={this.state.audioSkip}><i onClick={(e) => this.skipBackward(e)} className="fa fa-backward"></i>
                  <i onClick={(e) => this.skipForward(e)} className="fa fa-forward"></i></div>

                <audio
                  onPause={(e) => this.pauseSync(e)}
                  id="audio"
                  className="audio"
                  onError={(e) => this.onError(e)}
                  onCanPlay={(e) => this.onCanPlay(e)}
                  onPlay={(e) => this.onPlay(e)}
                  controls
                  autoPlay
                  loop
                  src={this.state.musicItemPlay} >
                </audio>

              </div>
            </div>
          </div>
        </div>
      </div>

    );
  }

  /* SETTING DEFUALT STATE*/
  componentDidMount() {
    /* Set oppropriate audio styling */
    this.setBrowserAudioPlayerStyle();
    /* default data for home screen */
    if (this.state.musicList.length < 1) {
      this.searchPlayList(3220851222)
    }
  }
}



export default MusicInfo;



