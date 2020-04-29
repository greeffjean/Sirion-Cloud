import React from 'react';
/* Stylesheets */
import '../css/MusicInfo.scss';
import '../css/MusicInfoResponsive.scss';
/* Components */
import MusicItem from './MusicItem';
import MusicDatabase from './MuiscDatabase';
import AlbumPortal from './AlbumPortal';
import TrackListPortal from './TrackListPortal';
import AudioPlayer from './AudioPlayer';
import GenreBar from './GenreBar';
/* Misc */
import logo from '../media/logo.png';




class MusicInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      /* playback */
      playBack: {
        skipDeactivate: "false",
      },
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
      musicItemInfo: {
        syncPlayAudio: [],
      },
      /* track identification variables */
      currentMusicItems: [],
      favourites: [],
      /*DOM styling conditions*/
      renderSearch: "false",
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
    /*(  on empty input dont retrun to Home State )*/
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
        playBack: {
          trackCanPlay: [],
          skipDeactivate: "true",
          checkPlay: this.state.playBack.checkPlay,
          checkPause: this.state.playBack.checkPause,
          pauseTracklistListener: this.state.playBack.pauseTracklistListener,
          skipActive: this.state.playBack.skipActive,
        },
        favouritesActive: "false",
        albumReady: "false",
        changeComponentActive: "false",
        renderSearch: "true",
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
    if (this.state.currentGenre == id && this.state.renderSearch == "false"
      && this.state.musicInfoGenre == "active" && this.state.favourites.length < 1) {
      return
    }
    else {
      console.log("feert")
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
          playBack: {
            trackCanPlay: this.state.playBack.trackCanPlay,
            skipDeactivate: "true",
            checkPlay: this.state.playBack.checkPlay,
            checkPause: this.state.playBack.checkPause,
            trackCanPlay: this.state.playBack.trackCanPlay,
            skipActive: this.state.playBack.skipActive,
          },
          musicList: newList,
          changeComponentActive: "false",
          currentGenre: response.id,
          musicInfoGenre: "active",
          musicInfoAlbum: [],
          musicInfoTracklist: [],
          favouritesActive: "false",
          renderSearch: "false",
          errorMessage: [],
          audioSkip: this.state.audioSkipHide,
        })
      })
    }
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
        playBack: {
          pauseTracklistListener: "false",
          skipDeactivate: "true",
          checkPlay: this.state.playBack.checkPlay,
          checkPause: this.state.playBack.checkPause,
          trackCanPlay: this.state.playBack.trackCanPlay,
          skipActive: this.state.playBack.skipActive,
        },
        albumReady: "true",
        musicInfoGenre: [],
        musicInfoAlbum: "active",
        musicInfoTracklist: [],
        renderSearch: "false",
        errorMessage: [],
        audioSkip: this.state.audioSkipHide,
        changeComponentActive: "true",
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
        playBack: {
          skipDeactivate: "true",
          pauseTracklistListener: "false",
          checkPlay: this.state.playBack.checkPlay,
          checkPause: this.state.playBack.checkPause,
          trackCanPlay: this.state.playBack.trackCanPlay,
          skipActive: this.state.playBack.skipActive,
        },
        changeComponentActive: "true",
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
        playBack: {
          skipDeactivate: "true",
          checkPlay: this.state.playBack.checkPlay,
          checkPause: this.state.playBack.checkPause,
          pauseTracklistListener: this.state.playBack.pauseTracklistListener,
          trackCanPlay: this.state.playBack.trackCanPlay,
          skipActive: this.state.playBack.skipActive,
        },
        musicList: this.state.favouritesMusicList,
        changeComponentActive: "false",
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
    console.log(value)
    /* (favourite variables) */
    var checkPlay = this.state.playBack.checkPlay;
    var musicList = this.state.musicList;
    var checkForEmptyList = this.state.musicItemInfo.musicId;
    var favourites = this.state.favourites;
    var favouritesMusicList = this.state.favouritesMusicList;
    var condition = [];
    var index = [];
    var favouritesActive = this.state.favouritesActive;
    var removeMusicItem = this.state.musicItemInfo.musicItemPlay;

    /*( Filtering Out Duplicates )*/
    /*( finding duplicates )*/
    if (favourites.length > 0) {
      favourites.map(val => {
        if (val === value.id) {
          condition = "false";
          index.push(favourites.indexOf(val));
          if (val === this.state.musicItemInfo.musicId) {
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
      removeMusicItem = [];
    }
    /*( apoint new State data )*/
    this.setState({
      favourites: favourites,
      favouritesMusicList: favouritesMusicList,
      musicList: musicList,
      musicItemInfo: {
        musicItemPlay: removeMusicItem,
        syncPlayAudio: this.state.musicItemInfo.musicItemPlay,
        musicItemTitle: this.state.musicItemInfo.musicItemTitle,
        musicItemAlbum: this.state.musicItemInfo.musicItemAlbum,
        musicItemAlbumArt: this.state.musicItemInfo.musicItemAlbumArt,
        musicId: checkForEmptyList, /* if favourite track plays and list gets emptied will the musicId = [] */
      },
      playBack: {
        checkPlay: checkPlay,
        trackCanPlay: this.state.playBack.trackCanPlay,
        skipDeactivate: this.state.playBack.skipDeactivate,
        checkPause: this.state.playBack.checkPause,
        pauseTracklistListener: this.state.playBack.pauseTracklistListener,
        skipActive: this.state.playBack.skipActive,
      }
    })
    /*( reset condition )*/
    condition = [];
  }

  /* Empty Favourites */
  emptyFavourites() {
    this.setState({
      musicItemInfo: {
        musicItemPlay: [],
        syncPlayAudio: this.state.musicItemInfo.musicItemPlay,
        musicItemTitle: this.state.musicItemInfo.musicItemTitle,
        musicItemAlbum: this.state.musicItemInfo.musicItemAlbum,
        musicItemAlbumArt: this.state.musicItemInfo.musicItemAlbumArt,
        musicId: this.state.musicItemInfo.musicId,
      },
      favourites: [],
      favouritesMusicList: [],
      playBack: {
        trackCanPlay: "false",
        checkPlay: [],
        checkPause: [],
        skipDeactivate: this.state.playBack.skipDeactivate,
        pauseTracklistListener: this.state.playBack.pauseTracklistListener,
        skipActive: this.state.playBack.skipActive,
      }
    })
  }


  /* MUSIC PLAYBACK */
  /*  Play Track Home State */
  playSong(track, album, title, albumArt, id) {
    var audioSkipActive = this.state.audioSkipActive.color;
    var checkPlay = this.state.playBack.checkPlay;
    var checkPause = this.state.playBack.checkPause;
    /*( find exisitng playing tracks in the DOM and apply styling )*/
    if(this.state.favouritesActive == "true"){
      if (track === this.state.syncPlayAudio) {
        checkPlay = "true";
        checkPause = "false";
      }
      else {
        checkPlay = "false";
        checkPause = "true";
      }
    }
 
    /*( audio player play )*/
    var audioplayer = document.getElementById("audio");
    audioplayer.play();

    /*( play song and appoint track data )*/
    this.setState({
      playBack: {
        checkPlay: checkPlay,
        checkPause: checkPause,
        trackCanPlay: [],
        skipActive: "false",
        skipDeactivate: this.state.playBack.skipDeactivate,
        pauseTracklistListener: this.state.playBack.pauseTracklistListener,
      },
      musicItemInfo: {
        musicItemTitle: title,
        musicItemAlbum: album,
        musicItemAlbumArt: albumArt,
        musicItemPlay: track,
        musicId: id,
        syncPlayAudio: this.state.musicItemInfo.musicItemPlay,
      },
      changeComponentActive: "false",
      audioSkip: { color: `${audioSkipActive}` },
    })

  }


  /*  Play Album Track */
  playAlbumTrack(value, assets) {
    var audioSkipActive = this.state.audioSkipActive.color;
    var checkPlay = this.state.playBack.checkPlay;
    var checkPause = this.state.playBack.checkPause;
    /*( find exisiitng playing tracks in the DOM and apply styling )*/
      if (value.preview === this.state.syncPlayAudio) {
        checkPlay = "true";
        checkPause = "false";
      }
         /*( find exisitng playing tracks in the DOM and apply styling )*/
    if (value.preview !== this.state.syncPlayAudio) {
      checkPlay = "false";
      checkPause = "true";
    }
    
    /*( audio player play )*/
    var audioplayer = document.getElementById("audio");
    audioplayer.play();

    /*( set State changes )*/
    this.setState({
      playBack: {
        checkPlay: checkPlay,
        checkPause: checkPause,
        skipDeactivate: "false",
        trackCanPlay: this.state.playBack.trackCanPlay,
        skipActive: this.state.playBack.skipActive,
        pauseTracklistListener: this.state.playBack.pauseTracklistListener,
      },
      musicItemInfo: {
        musicId: value.id,
        musicItemPlay: value.preview,
        musicItemTitle: value.title,
        musicItemAlbumArt: assets.cover_small,
        musicItemAlbum: value.artist.name,
        syncPlayAudio: this.state.musicItemInfo.musicItemPlay,
      },
      changeComponentActive: "true",
      tracklistTrackActive: 'false',
      audioSkip: { color: `${audioSkipActive}` },
    })

  }

  /*  Play TrackList Track */
  playTrackListTrack(value) {
    var audioSkipActive = this.state.audioSkipActive.color;
    var checkPlay = this.state.playBack.checkPlay;
    var checkPause = this.state.playBack.checkPause;
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

    /*( audio player play )*/
    var audioplayer = document.getElementById("audio");
    audioplayer.play();
    /*(set state changes)*/
    this.setState({
      playBack: {
        checkPlay: checkPlay,
        checkPause: checkPause,
        skipDeactivate: "false",
        trackCanPlay: this.state.playBack.trackCanPlay,
        skipActive: this.state.playBack.skipActive,
        pauseTracklistListener: this.state.playBack.pauseTracklistListener,
      },
      musicItemInfo: {
        musicItemPlay: value.preview,
        musicId: value.id,
        musicItemTitle: value.title,
        musicItemAlbum: value.album.title,
        musicItemAlbumArt: value.album.cover_small,
        syncPlayAudio: this.state.musicItemInfo.musicItemPlay,
      },
      changeComponentActive: "true",
      tracklistTrackActive: 'true',
      audioSkip: { color: `${audioSkipActive}` },
    })

  }

  /* On Can Play */
  onCanPlay() {
    /*( set State changes )*/
    this.setState({
      playBack: {
        checkPlay: "true",
        checkPause: "false",
        trackCanPlay: "true",
        skipActive: this.state.playBack.skipActive,
        skipDeactivate: this.state.playBack.skipDeactivate,
        pauseTracklistListener: this.state.playBack.pauseTracklistListener,
      },
      musicItemInfo: {
        syncPlayAudio: this.state.musicItemInfo.musicItemPlay,
        musicItemTitle: this.state.musicItemInfo.musicItemTitle,
        musicItemAlbum: this.state.musicItemInfo.musicItemAlbum,
        musicItemAlbumArt: this.state.musicItemInfo.musicItemAlbumArt,
        musicItemPlay: this.state.musicItemInfo.musicItemPlay,
        musicId: this.state.musicItemInfo.musicId,
      }
    })
  }

  /* On Play */
  onPlay() {
    /*( sync playback - DOM styling )*/
    if (this.state.musicItemInfo.musicItemPlay === this.state.musicItemInfo.syncPlayAudio) {
      this.setState({
        playBack: {
          checkPlay: "true",
          checkPause: "false",
          trackCanPlay: "true",
          skipActive: this.state.playBack.skipActive,
          skipDeactivate: this.state.playBack.skipDeactivate,
          pauseTracklistListener: this.state.playBack.pauseTracklistListener,
        },

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
      playBack: {
        checkPlay: "false",
        checkPause: "true",
        pauseTracklistListener: "true",
        trackCanPlay: "false",
        skipActive: this.state.playBack.skipActive,
        skipDeactivate: this.state.playBack.skipDeactivate,
      }
    })
  }

  /* Standard On Pause (sync audio player button and active musiclist item button) */
  pauseSync(e) {
    this.setState({
      playBack: {
        checkPause: "true",
        checkPlay: "false",
        trackCanPlay: "false",
        skipActive: this.state.playBack.skipActive,
        skipDeactivate: this.state.playBack.skipDeactivate,
        pauseTracklistListener: this.state.playBack.pauseTracklistListener,
      }
    })
  }

  /* Skip Forward Audio Player */
  skipForward() {
    /*( check for maximum skips limit )*/
    var maxSkip = this.state.musicList.length - 1;
    var checkPause = this.state.playBack.checkPause;
    var checkPlay = this.state.playBack.checkPlay;
    var pauseTracklistListener = this.state.playBack.pauseTracklistListener;
    if (this.state.musicItemInfo.musicId === this.state.musicList[maxSkip].id) {
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
      var currentItem = this.state.musicItemInfo.musicId;
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
      var musicItemAlbumArt = this.state.musicItemInfo.musicItemAlbumArt;
      var musicItemPlay = this.state.musicItemInfo.musicItemPlay;
      var musicItemTitle = this.state.musicItemInfo.musicItemTitle;
      var musicItemAlbum = this.state.musicItemInfo.musicItemAlbum;
      var musicId = this.state.musicItemInfo.musicId;
      var skipActive = this.state.playBack.skipActive;
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
      playBack: {
        checkPause: checkPause,
        checkPlay: checkPlay,
        pauseTracklistListener: pauseTracklistListener,
        skipActive: skipActive,
        trackCanPlay: this.state.playBack.trackCanPlay,
        skipDeactivate: this.state.playBack.skipDeactivate,
      },
      musicItemInfo: {
        musicId: musicId,
        musicItemAlbumArt: musicItemAlbumArt,
        musicItemTitle: musicItemTitle,
        musicItemAlbum: musicItemAlbum,
        musicItemPlay: musicItemPlay,
        syncPlayAudio: this.state.musicItemInfo.musicItemPlay,
      },
    })
  }

  /* Skip Backward Audio Player */
  skipBackward() {
    var checkPause = this.state.playBack.checkPause;
    var checkPlay = this.state.playBack.checkPlay;
    var pauseTracklistListener = this.state.playBack.pauseTracklistListener;
    /*( check for maximum skips limit )*/
    if (this.state.musicItemInfo.musicId === this.state.musicList[0].id) {
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
      var currentItem = this.state.musicItemInfo.musicId;
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
      var musicItemAlbumArt = this.state.musicItemInfo.musicItemAlbumArt;
      var musicItemPlay = this.state.musicItemInfo.musicItemPlay;
      var musicItemTitle = this.state.musicItemInfo.musicItemTitle;
      var musicItemAlbum = this.state.musicItemInfo.musicItemAlbum;
      var musicId = this.state.musicItemInfo.musicId;
      var skipActive = this.state.playBack.skipActive;
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
      playBack: {
        checkPause: checkPause,
        checkPlay: checkPlay,
        pauseTracklistListener: pauseTracklistListener,
        skipActive: skipActive,
        trackCanPlay: this.state.playBack.trackCanPlay,
        skipDeactivate: this.state.playBack.skipDeactivate,
      },
      musicItemInfo: {
        musicId: musicId,
        musicItemAlbumArt: musicItemAlbumArt,
        musicItemPlay: musicItemPlay,
        musicItemTitle: musicItemTitle,
        musicItemAlbum: musicItemAlbum,
        syncPlayAudio: this.state.musicItemInfo.musicItemPlay,
      },
    })
  }

  /* Reset Play/Pause */
  reset() {
    this.setState({
      playBack: {
        skipActive: "false",
        checkPlay: this.state.playBack.checkPlay,
        checkPause: this.state.playBack.checkPause,
        trackCanPlay: this.state.playBack.trackCanPlay,
        skipDeactivate: this.state.playBack.skipDeactivate,
        pauseTracklistListener: this.state.playBack.pauseTracklistListener,
      }
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
      playBack: {
        trackCanPlay: "false",
        checkPlay: this.state.playBack.checkPlay,
        checkPause: this.state.playBack.checkPause,
        skipActive: this.state.playBack.skipActive,
        skipDeactivate: this.state.playBack.skipDeactivate,
        pauseTracklistListener: this.state.playBack.pauseTracklistListener,
      }
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
              playBack={this.state.playBack}
              /*Info*/
              info={value}
              key={value.id}
              selector={value.id}
              itemInfo={this.state.musicItemInfo}
              favouriteStyling={favouriteStyling}
              /*Functions*/
              pauseSong={(e) => this.pauseSong(e)}
              playSong={(track, album, title, albumArt, id) => this.playSong(track, album, title, albumArt, id)}
              changeToAlbum={(id) => this.changeToAlbum(id)}
              addFavourites={(val) => this.addFavourites(val)}
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
        playBack={this.state.playBack}
        /*Info*/
        ready={this.state.albumReady}
        key={this.state.currentAlbumInfo.id}
        albumInfo={this.state.currentAlbumInfo}
        favouriteLog={this.state.favourites}
        itemInfo={this.state.musicItemInfo}
        /*Functions*/
        playTrack={(value, assets) => this.playAlbumTrack(value, assets)}
        changeToTrackList={(e) => this.changeToTrackList(e)}
        addFavourite={(val) => this.addFavourites(val)}
        resetState={(e) => this.resetState(e)}
        pauseTrack={(e) => this.pauseSong(e)}
      />)
    }


    /* push available tracklist information into DOM - create new list  */
    var trackList = [];
    if (this.state.trackListReady === "true") {
      trackList.push(< TrackListPortal
        /*PlayBack*/
        playBack={this.state.playBack}
        /*Info*/
        info={this.state.artistTrackList}
        key={this.state.artistId}
        artistTracks={this.state.musicList}
        ready={this.state.trackListReady}
        favouriteLog={this.state.favourites}
        albumChangeBack={this.state.currentAlbumInfo}
        itemInfo={this.state.musicItemInfo}
        /*Functions*/
        pauseTrack={(e) => this.pauseSong(e)}
        playTrack={(value, albumArt, artist, album, title) => this.playTrackListTrack(value, albumArt, artist, album, title)}
        moreTracks={(e) => this.moreTracksTrackList(e)}
        addFavourite={(val) => this.addFavourites(val)}
        changeToAlbum={(id, back_option) => this.changeToAlbum(id, back_option)}

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
              <GenreBar
                /* info */
                favourites={this.state.favourites}
                /* functions */
                searchPlayList={(e) => this.searchPlayList(e)}
                changeToFavourites={(e) => this.changeToFavourites(e)}

              />


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
                  {trackList}
                </div>

              </div>

              {/* Audio Player */}
              < AudioPlayer
                /* playback */
                playBack={this.state.playBack}
                /* info */
                itemInfo={this.state.musicItemInfo}
                audioplayerStyle={this.state.audioplayerStyle}
                audioSkip={this.state.audioSkip}
                /* functions */
                skipBackward={(e) => this.skipBackward(e)}
                skipForward={(e) => this.skipForward(e)}
                pauseSync={(e) => this.pauseSync(e)}
                onError={(e) => this.onError(e)}
                onCanPlay={(e) => this.onCanPlay(e)}
                onPlay={(e) => this.onPlay(e)}
              />
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



