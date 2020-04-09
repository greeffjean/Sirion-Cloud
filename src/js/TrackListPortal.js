import React from 'react';
import '../css/TrackListPortal.scss';
import '../css/TrackListPortalResponsive.scss'
import TrackListItem from './TrackListItem';




class Track_listPortal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pause: this.props.checkPause
    }
  }


  /*PLAYBACK*/
  /* Play Track */
  playTrack(value) {
    this.props.playTrackListTrack(value)
    this.setState({
      pause: "false"
    })
  }

  /* Pause Track */
  pauseTrack() {
    this.props.pauseTrack();
    this.setState({
      pause: "true"
    })
  }


  /* MISC */
  /* Add to Favourite */
  addFavourite(value) {
    this.props.addFavourite(value)
  }

  /* Change To Album Portal */
  changeToAlbum(id) {
    this.props.changeToAlbum(id)
  }

  /* Return to Previous Album */
  changeBackToAlbum() {
    this.props.changeToAlbum(this.props.albumChangeBack.id)
  }

  /* Change To Artist Portal */
  moreTracks() {
    this.props.moreTracks(this.props.trackListArtist[0].artist.name)
  }


  /* Render */
  render() {
    if (this.props.trackListReady === "true") {
      /* Render Track_list List Items */
      if (this.props.trackListReady === "true") {
        var trackList = [];
        this.props.trackListArtist.map(value => {

          /* Process data and output correct styling and format of time and favourite icon */
          var favouriteStyling = [];
          var getMinutes = Math.floor(value.duration / 60);
          var sum = getMinutes * 60;
          var getSeconds = value.duration - sum;
          var timeInfo = {
            getMinutes: getMinutes,
            sum: sum,
            getSeconds: getSeconds,
          }
          if (timeInfo.getSeconds.toString().length === 1) {
            timeInfo.getSeconds = "0" + timeInfo.getSeconds.toString();
          }
          /* Searching For Selected Favourites - applying correct styling */
          this.props.favouriteLog.map(val => {
            if (val == value.id) {
              favouriteStyling = "true"
            }
          })

          /* Adding New List Items */
          trackList.push(< TrackListItem
            /*PlayBack*/
            checkPlay={this.props.checkPlay}
            checkPause={this.props.checkPause}
            /*Functions*/
            addFavourite={(value) => this.addFavourite(value)}
            changeToAlbum={(id) => this.changeToAlbum(id)}
            playTrack={(value) => this.playTrack(value)}
            pauseTrack={(e) => this.pauseTrack(e)}
            /*Info*/
            key={value.id}
            value={value}
            timeInfo={timeInfo}
            favouriteStyling={favouriteStyling}
            albumInfo={this.props.albumInfo}
            musicId={this.props.musicId}
          />)
        })
      }

      /* Render Default Right Track Info */
      var currentTrack = [];

      /* Render Right Track Info Data */
      this.props.trackListArtist.map(value => {
        if (value.id === this.props.musicId) {
          currentTrack.push(value)
        }
      })
    }


    /* Return */
    return (

      <div className="track_list_container">
        {/* Track List Left Information */}
        <div className="track_list_inner_left">
          {/* Track List Left Information */}
          <div className="track_list_inner_left_heading">
            <div className="track_list_inner_left_heading_left">
               <div className="track_list_art"
              style={{ background: `url("${this.props.trackListArtist[0].artist.picture_medium}")`, backgroundSize: "cover", backgroundPosition: "center" }} >
            </div>
            </div>
            <div className="track_list_inner_left_heading_right">
              <div className="track_list_inner_left_heading_right_top"> <h2>{this.props.trackListArtist[0].artist.name}</h2> <h1>Track List</h1></div>
              <div className="track_list_inner_left_heading_right_bottom">
                <div className=" track_list_inner_left_heading_right_bottom_top">
                  <i className="fa fa-music"> {this.props.trackListInfo.total}</i>
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=https://www.deezer.com/en/artist/${this.props.trackListArtist[0].artist.id}`}>Facebook</a>
                  <a href={`https://twitter.com/home?status=https://www.deezer.com/en/artist/${this.props.trackListArtist[0].artist.id} `}>Twitter</a>
                  <a href={`https://pinterest.com/pin/create/button/?url=https://www.deezer.com/en/artist/${this.props.trackListArtist[0].artist.id}&media=&description=`}>Pintrest</a>
                </div>
                <div onClick={(e) => this.changeBackToAlbum(e)} className=" track_list_inner_left_heading_right_bottom_bottom bottom_special_align">
                  <p>Return to {this.props.albumChangeBack.title}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Track List Track List */}
          <div className="track_list_inner_left_list_container">
            <div className="track_list_inner_left_list">
              {trackList}
            </div>

            <div className="spacer">
              <p onClick={(e) => this.moreTracks(e)}>+</p>

            </div>
          </div>
        </div>

        {/* Track List Right Inforamtion */}
        <div className="track_list_inner_right">
          <div className="track_list_inner_right_information">
            <div className="track_list_art_right">
               <img src={currentTrack.length > 0 ? `${currentTrack[0].album.cover_big}` : `${this.props.trackListArtist[0].artist.picture_big}`}></img> 
               </div>;
            <div className="overlap_info">
              <h5 className="title">{currentTrack.length > 0 ? currentTrack[0].title : "--"}</h5>
              <h4>{currentTrack.length > 0 ? currentTrack[0].album.title : "--"}</h4>
              <div className="playback_status">
                <h5 id="title_right">
                  {this.state.pause != "true" ? "NOW PLAYING  " : "PAUSED  "}
                  {typeof this.props.currentMusicItemTitle != "undefined" ? `${this.props.currentMusicItemTitle}` : `--`}
                </h5>
              </div>

            </div>
          </div>
        </div>
      </div>

    );
  }
}


export default Track_listPortal;



