import React from 'react';
import '../css/TrackListPortal.scss';
import '../css/TrackListPortalResponsive.scss'
import TrackListItem from './TrackListItem';




class TrackListPortal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
     
    }
  }


  /*PLAYBACK*/
  /* Play Track */
  playTrack(value) {
    this.props.playTrack(value)
  }

  /* Pause Track */
  pauseTrack() {
    this.props.pauseTrack();
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
    this.props.moreTracks(this.props.artistTracks[0].artist.name)
  }


  /* Render */
  render() {
    if (this.props.ready === "true") {
      /* Render Track_list List Items */
      if (this.props.ready === "true") {
        var trackList = [];
        this.props.artistTracks.map(value => {

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
            playBack={this.props.playBack}
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
            itemInfo={this.props.itemInfo}
          />)
        })
      }

      /* Render Default Right Track Info */
      var currentTrack = [];

      /* Render Right Track Info Data */
      this.props.artistTracks.map(value => {
        if (value.id === this.props.itemInfo.musicId) {
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
              style={{ background: `url("${this.props.artistTracks[0].artist.picture_medium}")`, backgroundSize: "cover", backgroundPosition: "center" }} >
            </div>
            </div>
            <div className="track_list_inner_left_heading_right">
              <div className="track_list_inner_left_heading_right_top"> <h2>{this.props.artistTracks[0].artist.name}</h2> <h1>Track List</h1></div>
              <div className="track_list_inner_left_heading_right_bottom">
                <div className=" track_list_inner_left_heading_right_bottom_top">
                  <i className="fa fa-music"> {this.props.info.total}</i>
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=https://www.deezer.com/en/artist/${this.props.artistTracks[0].artist.id}`}>Facebook</a>
                  <a href={`https://twitter.com/home?status=https://www.deezer.com/en/artist/${this.props.artistTracks[0].artist.id} `}>Twitter</a>
                  <a href={`https://pinterest.com/pin/create/button/?url=https://www.deezer.com/en/artist/${this.props.artistTracks[0].artist.id}&media=&description=`}>Pintrest</a>
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
               <img src={currentTrack.length > 0 ? `${currentTrack[0].album.cover_big}` : `${this.props.artistTracks[0].artist.picture_big}`}></img> 
               </div>;
            <div className="overlap_info">
              <h5 className="title">{currentTrack.length > 0 ? currentTrack[0].title : "--"}</h5>
              <h4>{currentTrack.length > 0 ? currentTrack[0].album.title : "--"}</h4>
              <div className="playback_status">
                <h5 id="title_right">
                  {this.props.playBack.trackCanPlay != "false" ? "NOW PLAYING  " : "PAUSED  "}
                  {typeof this.props.itemInfo.musicItemTitle != "undefined" ? `${this.props.itemInfo.musicItemTitle}` : `--`}
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>

    );
  }
}


export default TrackListPortal;



