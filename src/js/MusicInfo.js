import React from 'react';
import '../css/MusicInfo.css';
import MusicItem from './MusicItem';
import MusicDatabase from './MuiscDatabase';
import AlbumPortal from './AlbumPortal';
import TrackListPortal from './TrackListPortal';
import logo from '../media/logo.png';




class MusicInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      /*apply browser styling*/
      browser: this.getBrowser(),
      /* music lists */
      music_list: [],
      favourites_music_list: [],
      /*componenet active states*/
      music_info_genre: "active",
      music_info_album: [],
      music_info_tracklist: [],
      /*info variables*/
      current_album_info: [],
      current_search_info: [],
      /* track identification variables */
      current_music_items: [],
      favourites: [],
      /*DOM styling conditions*/
      render_search: "false",
      skip_deactivate: "false",
      sync_play_audio: [],
      audioplayer_style: {
        audio_player: { background: "hsl(200, 12%, 95%)" },
        audio_player_titles_first: { color: "coral" },
        audio_player_titles_second: { color: "grey" },
      },
      audio_skip: { color: "grey", pointerEvents: "none" },
      /*miscellaneous*/
      current_genre: [],
      name: [],
      typingTimeout: 0,
      error_message: [],
    }
    /*DOM refs*/
    this.music_containerRef = React.createRef();
    this.inputRef = React.createRef();
  }






  /* HOME STATE LIST */
  /* SEARCH*/
  /* Input Search Part1  */
  changeName(event) {
    /*( on render always start at top )*/
    this.music_containerRef.current.scrollTo(0, 0);
    /*(trigger load)*/
    this.triggerLoad()
    /*(disable components)*/
    this.albumDisable();
    this.tracklistDisable();
    /*( empty input dont run function )*/
    var term = this.state.name;
    if (event.target.value === '') {
      this.setState({
        search_timeout_disable: true
      })
      this.searchPlayList(this.state.current_genre)
      return
    }

    /*( set state changes )*/
    else {
      this.setState({
        track_can_play: [],
        favourites_active: "false",
        album_ready: "false",
        change_component_active: "false",
        render_search: "true",
        skip_deactivate: "true",
        error_message: [],
        search_timeout_disable: false,
        audio_skip: this.state.audio_skip_hide,
        music_info_genre: "active",
        music_info_album: [],
        music_info_tracklist: [],
      })


      /*( call search render smoothly )*/
      const self = this;
      if (self.state.typingTimeout) {
        clearTimeout(self.state.typingTimeout);
      }
      self.setState({
        music_list: [],
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
        this.state.error_message = "nothing found";
        this.errorMessage()
      }
      /*( fetch - filter redundant data )*/
      response.data.map(value => {
        if (value.preview != "") {
          newList.push(value)
        }
      })
      /*( fetch - apoint new data - if search_timout is not disabled )*/
      if (this.state.search_timeout_disable === true && this.state.name.length < 2) {
        return
      }
      else {
        this.setState({
          music_list: newList,
        })
      }
      /*( add more tracks to the render )*/
      this.renderMoreSearch()
    })
  }

  /* Change To Genre PlayList */
  searchPlayList(id) {
    /*( on render always start at top )*/
    this.music_containerRef.current.scrollTo(0, 0);
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
        music_list: newList,
        change_component_active: "false",
        current_genre: response.id,
        music_info_genre: "active",
        music_info_album: [],
        music_info_tracklist: [],
        skip_deactivate: "true",
        favourites_active: "false",
        render_search: "false",
        error_message: [],
        audio_skip: this.state.audio_skip_hide,
      })
    })
  }

  /* Render More Input Search */
  renderMoreSearch() {
    var more_music = this.state.music_list;
    /*( fetch)*/
    MusicDatabase.searchMoreTitles(this.state.name, this.state.music_list.length + 25).then(response => {
      response.data.map(value => {
        if (value.preview != "") {
          more_music.push(value)
        }
      });
    })
    /*( remove duplicate values)*/
    var single_values_arr = more_music;
    const uniqueList = Array.from(new Set(single_values_arr.map(a => a.id))).map(id => {
      return single_values_arr.find(a => a.id === id)
    })
    more_music = uniqueList
    /*( apoint new data )*/
    this.setState({
      music_list: more_music,
    })
  }


  /* ALBUM */
  /* Change To Album */
  changeToAlbum(id) {
    /*( on render always start at top )*/
    this.music_containerRef.current.scrollTo(0, 0);
    /*(trigger load)*/
    this.triggerLoad();
    /*(disable components)*/
    this.tracklistDisable();
    /*( empty search field )*/
    this.inputRef.current.value = '';
    /*( fetch )*/
    var album_list = [];
    MusicDatabase.searchAlbum(id).then(response => {
      response.tracks.data.map(value => {
        if (value.preview != "" && value.readable != false) {
          album_list.push(value)
        }
      })
      /*( smooth functioning )*/
      setTimeout(function () { }, 1000)
      this.setState({
        album_ready: "true",
        music_info_genre: [],
        music_info_album: "active",
        music_info_tracklist: [],
        render_search: "false",
        error_message: [],
        pause_tracklist_listener: "false",
        audio_skip: this.state.audio_skip_hide,
        change_component_active: "true",
        skip_deactivate: "true",
        favourites_active: "false",
        current_album_info: response,
        music_list: album_list,
        artist_id: response.artist.id
      })
    })
  }

  /*disable album render*/
  albumDisable() {
    this.setState({
      album_ready: [],
    })
  }



  /* PLAYLIST */
  /* Change To Tracklist */
  changeToTrackList(name) {
    /*( on render always start at top )*/
    this.music_containerRef.current.scrollTo(0, 0);
    /*(trigger load)*/
    this.triggerLoad();
    /*(disable components)*/
    this.albumDisable();
    /*( fetch )*/
    var artist_track_list = [];
    MusicDatabase.searchTitle(name).then(response => {
      response.data.map(value => {
        if (value.preview != "" && value.readable != false) {
          artist_track_list.push(value)
        }
      })
      /*( set State changes )*/
      this.setState({
        change_component_active: "true",
        skip_deactivate: "true",
        audio_skip: this.state.audio_skip_hide,
        favourites_active: "false",
        music_list: artist_track_list,
        artist_track_list: response,
        track_list_ready: "true",
        music_info_genre: [],
        music_info_album: [],
        music_info_tracklist: "active",
        render_search: "false",
        error_message: [],
        pause_tracklist_listener: "false",
        playlist_return_data: name,
      })
    })
  }

  /* Render More Playlist Tracks */
  moreTracksTrackList(name) {
    var artist_track_list = this.state.artist_track_list.data;
    /*( fetch )*/
    MusicDatabase.searchMoreTrackList(name, this.state.music_list.length + 25).then(response => {
      response.data.map(value => {
        if (value.preview != "") {
          artist_track_list.push(value)
        }
      })
      /*( remove duplicate values)*/
      var single_values_arr = artist_track_list;
      const uniqueList = Array.from(new Set(single_values_arr.map(a => a.id))).map(id => {
        return single_values_arr.find(a => a.id === id)
      })
      artist_track_list = uniqueList

      /*( apoint new data )*/
      this.setState({
        music_list: artist_track_list,
      })
    })
  }

  /*disable tracklist render*/
  tracklistDisable() {
    this.setState({
      track_list_ready: [],
    })
  }



  /* FAVOURITES */
  /* Change State To Favourites */
  changeToFavourites() {
    /* (return empty fuction if list is un-populated) */
    if (this.state.favourites_music_list.length == 0) {
      console.log("empty")
      return
    }
    else {
      /* (start at top) */
      this.music_containerRef.current.scrollTo(0, 0);
      /*(disable components)*/
      this.albumDisable();
      this.tracklistDisable();
      /*(empty input field)*/
      this.inputRef.current.value = '';
      /*(trigger load)*/
      this.triggerLoad();
      /*( set state changes )*/
      this.setState({
        music_list: this.state.favourites_music_list,
        change_component_active: "false",
        skip_deactivate: "true",
        favourites_active: "true",
        error_message: [],
        audio_skip: this.state.audio_skip_hide,
        music_info_genre: "active",
        music_info_album: [],
        music_info_tracklist: [],
      })
    }
  }

  /* Adds and Removes Items */
  addFavourites(value) {
    /* (favourite variables) */
    var check_play = this.state.check_play;
    var music_list = this.state.music_list;
    var check_for_empty_list = this.state.music_id;
    var favourites = this.state.favourites;
    var favourites_music_list = this.state.favourites_music_list;
    var condition = [];
    var index = [];
    var favourites_active = this.state.favourites_active;

    /*( Filtering Out Duplicates )*/
    /*( finding duplicates )*/
    if (favourites.length > 0) {
      favourites.map(val => {
        if (val === value.id) {
          condition = "false"
          index.push(favourites.indexOf(val));
          if (val === this.state.music_id) {
            check_play = "empty"
          }
        }
      })
    }
    /*( filtering duplicates )*/
    if (condition == "false") {
      var filtered_array = favourites.filter(function (x) {
        return x !== value.id;
      });
      var filter_array_music_list = favourites_music_list.filter(function (x) {
        return x.id !== value.id;
      });
      favourites = filtered_array;
      favourites_music_list = filter_array_music_list;
    }
    /*( Add if no duplicates exist )*/
    else if (condition != "false" && favourites.length >= 0) {
      favourites.push(value.id)
      favourites_music_list.push(value);
    }
    /*( apoint new data to variable )*/
    if (favourites_active === "true") {
      music_list = filter_array_music_list;
    }
    /*( Favourite list is empty function )*/
    if (this.state.favourites_active === "true" && favourites_music_list.length === 0) {
      this.emptyFavourites()
      this.searchPlayList(this.state.current_genre)
      check_for_empty_list = [];
      check_play = "empty";
    }
    /*( apoint new State data )*/
    this.setState({
      favourites: favourites,
      favourites_music_list: favourites_music_list,
      music_id: check_for_empty_list, /* if favourite track plays and list gets emptied will the music_id = [] */
      music_list: music_list,
      check_play: check_play
    })
    /*( reset condition )*/
    condition = [];
  }

  /* Empty Favourites */
  emptyFavourites() {
    this.setState({
      music_item_play: [],
      favourites: [],
      favourites_music_list: [],
      track_can_play: "false",
      checkPlay: [],
      checkPause: [],
    })
  }


  /* MUSIC PLAYBACK */
  /*  Play Track Home State */
  playSong(track, album, title, album_art, id) {
    console.log(album_art)
    var check_play = this.state.check_play;
    var check_pause = this.state.check_pause;
    /*( find exisitng playing tracks in the DOM and apply styling )*/
    if (track === this.state.sync_play_audio) {
      check_play = "true";
      check_pause = "false";
    }
    else {
      check_play = "false";
      check_pause = "true";
    }

    /*( play song and appoint track data )*/
    this.setState({
      check_play: check_play,
      check_pause: check_pause,
      track_can_play: [],
      music_item_play: track,
      music_item_title: title,
      music_item_album: album,
      music_item_album_art: album_art,
      music_id: id,
      skip_active: "false",
      change_component_active: "false",
    })
    /*( audio player play )*/
    var audioplayer = document.getElementById("audio");
    audioplayer.play();
  }


  /*  Play Album Track */
  playAlbumTrack(value, assets) {
    var check_play = this.state.check_play;
    var check_pause = this.state.check_pause;
    /*( find exisitng playing tracks in the DOM and apply styling )*/
    if (value.preview === this.state.sync_play_audio) {
      check_play = "true";
      check_pause = "false";
    }
    /*( find exisitng playing tracks in the DOM and apply styling )*/
    if (value.preview !== this.state.sync_play_audio) {
      check_play = "false";
      check_pause = "true";
    }
    /*( set State changes )*/
    this.setState({
      check_play: check_play,
      check_pause: check_pause,
      music_item_play: value.preview,
      music_id: value.id,
      music_item_title: value.title,
      music_item_album_art: assets.cover_small,
      music_item_album: value.artist.name,
      change_component_active: "true",
      tracklist_track_active: 'false',
      skip_deactivate: "false",
    })
    /*( audio player play )*/
    var audioplayer = document.getElementById("audio");
    audioplayer.play();
  }

  /*  Play TrackList Track */
  playTrackListTrack(value) {
    var check_play = this.state.check_play;
    var check_pause = this.state.check_pause;
    /*( find exisitng playing tracks in the DOM and apply styling )*/
    if (value.preview === this.state.sync_play_audio) {
      check_play = "true";
      check_pause = "false";
    }
    /*( find exisitng playing tracks in the DOM and apply styling )*/
    if (value.preview !== this.state.sync_play_audio) {
      check_play = "false";
      check_pause = "true";
    }
    /*(set state changes)*/
    this.setState({
      check_play: check_play,
      check_pause: check_pause,
      music_item_play: value.preview,
      music_id: value.id,
      music_item_title: value.title,
      music_item_album: value.album.title,
      music_item_album_art: value.album.cover_small,
      change_component_active: "true",
      tracklist_track_active: 'true',
      skip_deactivate: "false",
    })
    /*( audio player play )*/
    var audioplayer = document.getElementById("audio");
    audioplayer.play();
  }

  /* On Can Play */
  onCanPlay() {
    /*( set State changes )*/
    this.setState({
      track_can_play: "true",
      check_play: "true",
      check_pause: "false",
      sync_play_audio: this.state.music_item_play,
    })
  }

  /* On Play */
  onPlay() {
    var audio_skip_active = this.state.audio_skip_active.color;
    /*( sync playback - DOM styling )*/
    if (this.state.music_item_play === this.state.sync_play_audio) {
      this.setState({
        check_play: "true",
        check_pause: "false",
        audio_skip: { color: `${audio_skip_active}` },
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
      check_play: "false",
      check_pause: "true",
      pause_tracklist_listener: "true",
    })
  }

  /* Standard On Pause (sync audio player button and active musiclist item button) */
  pauseSync(e) {
    this.setState({
      check_pause: "true",
      check_play: "false",
    })
  }

  /* Skip Forward Audio Player */
  skipForward() {
    /*( check for maximum skips limit )*/
    var maxSkip = this.state.music_list.length - 1;
    var check_pause = this.state.check_pause;
    var check_play = this.state.check_play;
    var pause_tracklist_listener = this.state.pause_tracklist_listener;
    if (this.state.music_id === this.state.music_list[maxSkip].id) {
      check_pause = "false";
      check_play = "true";
      pause_tracklist_listener = "false";
      return
    }
    else {
      /*( set State - ensure DOM styling changes when track plays)*/
      check_pause = "true";
      check_play = "false";
      skip_active = "false";
      pause_tracklist_listener = "false";
      /* (findng a match) */
      var musicList = this.state.music_list;
      var currentItem = this.state.music_id;
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
      var music_item_album_art = this.state.music_item_album_art;
      var music_item_play = this.state.music_item_play;
      var music_item_title = this.state.music_item_title;
      var music_item_album = this.state.music_item_album;
      var music_id = this.state.music_id;
      var skip_active = this.state.skip_active;
      /*(tracklist skip state)*/
      if (this.state.change_component_active === "true" && this.state.tracklist_track_active === 'true') {
        music_item_album_art = nextMusicItemInfo[0].album.cover_small;
        music_item_play = nextMusicItemInfo[0].preview;
        music_item_title = nextMusicItemInfo[0].title;
        music_item_album = nextMusicItemInfo[0].album.title;
        music_id = nextMusicItemInfo[0].id;
        skip_active = "true";
      }

      /*(album skip state)*/
      else if (this.state.change_component_active === "true") {
        music_item_play = nextMusicItemInfo[0].preview;
        music_item_title = nextMusicItemInfo[0].title;
        music_item_album = nextMusicItemInfo[0].artist.name;
        music_id = nextMusicItemInfo[0].id;
        skip_active = "true";
      }

      /*(defualt state)*/
      else {
        music_item_album_art = nextMusicItemInfo[0].album.cover_small;
        music_item_play = nextMusicItemInfo[0].preview;
        music_item_title = nextMusicItemInfo[0].title;
        music_item_album = nextMusicItemInfo[0].album.title;
        music_id = nextMusicItemInfo[0].id;
        skip_active = "true";
      }
    }
    /* (apoint new data) */
    this.setState({
      check_pause: check_pause,
      check_play: check_play,
      pause_tracklist_listener: pause_tracklist_listener,
      skip_active: skip_active,
      music_item_album_art: music_item_album_art,
      music_item_play: music_item_play,
      music_item_title: music_item_title,
      music_item_album: music_item_album,
      music_id: music_id,
    })
  }

  /* Skip Backward Audio Player */
  skipBackward() {
    var check_pause = this.state.check_pause;
    var check_play = this.state.check_play;
    var pause_tracklist_listener = this.state.pause_tracklist_listener;
    /*( check for maximum skips limit )*/
    if (this.state.music_id === this.state.music_list[0].id) {
      check_pause = "false";
      check_play = "true";
      pause_tracklist_listener = "false";
      return
    }

    /*( set State - ensure DOM styling changes when track plays)*/
    else {
      check_pause = "true";
      check_play = "false";
      skip_active = "false";
      pause_tracklist_listener = "false";
      var musicList = this.state.music_list;
      var currentItem = this.state.music_id;
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
      var music_item_album_art = this.state.music_item_album_art;
      var music_item_play = this.state.music_item_play;
      var music_item_title = this.state.music_item_title;
      var music_item_album = this.state.music_item_album;
      var music_id = this.state.music_id;
      var skip_active = this.state.skip_active;
      /*(tracklist skip state)*/
      if (this.state.change_component_active === "true" && this.state.tracklist_track_active === 'true') {
        music_item_album_art = nextMusicItemInfo[0].album.cover_small;
        music_item_play = nextMusicItemInfo[0].preview;
        music_item_title = nextMusicItemInfo[0].title;
        music_item_album = nextMusicItemInfo[0].album.title;
        music_id = nextMusicItemInfo[0].id;
        skip_active = "true";
      }

      /*(album skip state)*/
      else if (this.state.change_component_active === "true") {
        music_item_play = nextMusicItemInfo[0].preview;
        music_item_title = nextMusicItemInfo[0].title;
        music_item_album = nextMusicItemInfo[0].artist.name;
        music_id = nextMusicItemInfo[0].id;
        skip_active = "true";
      }

      /*(defualt state)*/
      else {
        music_item_album_art = nextMusicItemInfo[0].album.cover_small;
        music_item_play = nextMusicItemInfo[0].preview;
        music_item_title = nextMusicItemInfo[0].title;
        music_item_album = nextMusicItemInfo[0].album.title;
        music_id = nextMusicItemInfo[0].id;
        skip_active = "true";
      }
    }
    /* (apoint new data) */
    this.setState({
      check_pause: check_pause,
      check_play: check_play,
      pause_tracklist_listener: pause_tracklist_listener,
      skip_active: skip_active,
      music_item_album_art: music_item_album_art,
      music_item_play: music_item_play,
      music_item_title: music_item_title,
      music_item_album: music_item_album,
      music_id: music_id,
    })
  }

  /* Reset Play/Pause */
  reset() {
    this.setState({
      skip_active: "false"
    })
  }

  /* MISC */
  /* Trigger Loading Animation */
  triggerLoad() {
    this.setState({
      music_list: []
    })
  }

  /* Errors */
  onError() {
    this.setState({
      track_can_play: "false"
    })
  }

  /* Error Mesage */
  errorMessage() {
    this.setState({
      music_info_genre: [],
      music_info_album: [],
      music_info_tracklist: [],
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
    var audio_player = [];
    var audio_skip = [];
    var audio_skip_hide = [];
    var audio_player_titles_first = [];
    var audio_player_titles_second = [];
    if (this.state.browser == 'Chrome' || 'Opera') {
      audio_player.push("hsl(200, 12%, 95%)");
      audio_skip.push("grey");
      audio_skip_hide.push("lightgrey")
      audio_player_titles_first.push("coral");
      audio_player_titles_second.push("grey");
    }
    if (this.state.browser == 'Firefox') {
      audio_player.push("hsl(0, 0%, 13%)");
      audio_skip.push("white");
      audio_skip_hide.push("lightgrey")
      audio_player_titles_first.push("lightgrey");
      audio_player_titles_second.push("white");
    }
    if (this.state.browser == 'Safari') {
      audio_player.push("hsl(180, 1%, 24%)");
      audio_skip.push("white");
      audio_skip_hide.push("lightgrey")
      audio_player_titles_first.push("lightgrey");
      audio_player_titles_second.push("white");
    }
    if (this.state.browser == 'MSIE') {
      audio_player.push("black");
      audio_skip.push("white");
      audio_skip_hide.push("lightgrey")
      audio_player_titles_first.push("lightgrey");
      audio_player_titles_second.push("white");
    }
    this.setState({
      audioplayer_style: {
        audio_player: { background: `${audio_player}` },
        audio_player_titles_first: { color: `${audio_player_titles_first}` },
        audio_player_titles_second: { color: `${audio_player_titles_second}` },
      },
      audio_skip_hide: { color: `${audio_skip_hide}`, pointerEvents: "none" },
      audio_skip_active: { color: `${audio_skip}` },
      audio_skip: { color: `${audio_skip_hide}`, pointerEvents: "none" },
    })
  }




  /* RENDER */
  render() {

    /* search input error message */
    var error_message = [];
    if (this.state.error_message === "nothing found") {
      error_message.push(<p className="error_message">NOTHING FOUND...</p>)
    }
    else {
      error_message = []
    }

    /* PUSH AVAILABLE DATA INTO DOM */
    var genre_items = [];
    if (typeof this.state.music_list != 'undefined' && this.state.change_component_active != "true") {
      if (this.state.music_list.length > 0) {
        this.state.music_list.map(value => {

          /* check for favourites and apply styling */
          var favourite_styling = [];
          this.state.favourites.map(val => {
            if (val == value.id) {
              favourite_styling = "true"
            }
          })

          /* create new list */
          if (value.preview !== "" && value.readable !== false) {
            genre_items.push(< MusicItem
              /*PlayBack*/
              check_play={this.state.check_play}
              check_pause={this.state.check_pause}
              /*Functions*/
              pauseSong={(e) => this.pauseSong(e)}
              playSong={(track, album, title, album_art, id) => this.playSong(track, album, title, album_art, id)}
              changeToAlbum={(id) => this.changeToAlbum(id)}
              addFavourites={(val) => this.addFavourites(val)}
              /*Info*/
              info={value}
              key={value.id}
              selector={value.id}
              music_id={this.state.music_id}
              skip_active={this.state.skip_active}
              favourite_styling={favourite_styling}
            />)
          }
          favourite_styling = [];
        })
      }
    }


    /* push available album information into DOM - create new list  */
    var album_portal = [];
    if (this.state.album_ready === 'true') {
      album_portal.push(< AlbumPortal
        /*PlayBack*/
        check_pause={this.state.check_pause}
        check_play={this.state.check_play}
        /*Functions*/
        playTrack={(value, assets) => this.playAlbumTrack(value, assets)}
        changeToTrackList={(e) => this.changeToTrackList(e)}
        addFavourite={(val) => this.addFavourites(val)}
        resetState={(e) => this.resetState(e)}
        pauseTrack={(e) => this.pauseSong(e)}
        /*Info*/
        album_ready={this.state.album_ready}
        key={this.state.current_album_info.id}
        album_info={this.state.current_album_info}
        music_id={this.state.music_id}
        favourite_log={this.state.favourites}
        current_music_item_title={this.state.music_item_title}

      />)
    }


    /* push available tracklist information into DOM - create new list  */
    var track_list = [];
    if (this.state.track_list_ready === "true") {
      track_list.push(< TrackListPortal
        /*PlayBack*/
        check_pause={this.state.check_pause}
        check_play={this.state.check_play}
        /*Functions*/
        pauseTrack={(e) => this.pauseSong(e)}
        playTrackListTrack={(value, album_art, artist, album, title) => this.playTrackListTrack(value, album_art, artist, album, title)}
        moreTracks={(e) => this.moreTracksTrackList(e)}
        addFavourite={(val) => this.addFavourites(val)}
        changeToAlbum={(id, back_option) => this.changeToAlbum(id, back_option)}
        /*Info*/
        key={this.state.artist_id} 
        track_list_info={this.state.artist_track_list}   
        track_list_artist={this.state.music_list}
        music_id={this.state.music_id}
        track_list_ready={this.state.track_list_ready}  
        favourite_log={this.state.favourites}  
        album_change_back={this.state.current_album_info}
        current_music_item_title={this.state.music_item_title}
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
              <div ref={this.music_containerRef} className='music_info_container'>

                {/* loader */}
                <div className={this.state.music_list.length > 0 || this.state.error_message === "nothing found" ? "loader disable" : "loader"}>
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
                {error_message}


                {/* render area for genre items */}
                <div className={this.state.music_info_genre == "active" ? "music_info_genre" : "music_info_genre disable"}>
                  {genre_items}
                  <div className={this.state.render_search === "true" && this.state.favourites_active != "true" ? "spacer_genre active" : "spacer_genre"}>
                    <p onClick={(e) => this.renderMoreSearch(e)}>+</p>
                  </div>
                </div>

                {/* render area for album items  */}
                <div className={this.state.music_info_album == "active" ? "music_info_album enable" : "music_info_album"}>
                  {album_portal}
                </div>

                {/* render area for tracklist items  */}
                <div className={this.state.music_info_tracklist == "active" ? "music_info_tracklist enable" : "music_info_tracklist"}>
                  {track_list}
                </div>

              </div>

              {/* audio player */}
              <div className={typeof this.state.check_play != "undefined" && this.state.check_play != "empty" ? "audio_player active" : "audio_player"} style={this.state.audioplayer_style.audio_player}>
                <div className="audio_info">
                  <img src={`${this.state.music_item_album_art}`}></img>
                  <div className="audio_player_titles" >
                    <p className="first" style={this.state.audioplayer_style.audio_player_titles_first}>{this.state.music_item_title}</p>
                    <p className="second" style={this.state.audioplayer_style.audio_player_titles_second} >{this.state.music_item_album}</p>
                  </div>
                </div>
                <div className="audio_skip" style={this.state.audio_skip}><i onClick={(e) => this.skipBackward(e)} className="fa fa-backward"></i>
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
                  src={this.state.music_item_play} >
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
    if (this.state.music_list.length < 1) {
      this.searchPlayList(3220851222)
    }
  }
}



export default MusicInfo;



