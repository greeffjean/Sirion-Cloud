import React from 'react';
import '../css/AlbumPortal.scss';
import AlbumItem from './AlbumItem'




class AlbumPortal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
     
    }
  }

  /*PLAYBACK*/
  /* Play Track */
  playTrack(value, assets) {
    this.props.playTrack(value, assets)
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
  /* Change To Artist Portal */
  changeToTrackList() {
    this.props.changeToTrackList(this.props.albumInfo.artist.name)
  }
  /* Reset */
  resetState() {
    this.props.resetState()
  }




  /* Render */
  render() {

    /* Render Album List Items */
    if (this.props.albumInfo != []) {
      var assets = this.props.albumInfo;
      var trackList = [];
      if (this.props.albumInfo.tracks.data) {
        this.props.albumInfo.tracks.data.map(value => {

          /* Styling and Time Formating of Track Info */
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
              favouriteStyling = true
            }
          })

          /* Adding New List Items */
          trackList.push(<AlbumItem
            /*PlayBack*/
            playBack={this.props.playBack}
            /*Functions*/
            playTrack={(value, assets) => this.playTrack(value, assets)}
            pauseTrack={(e) => this.pauseTrack(e)}
            addFavourite={(value) => this.addFavourite(value)}
            changeToTrackList={(e) => this.changeToTrackList(e)}
            /*Info*/
            key={value.id}
            assets={this.props.albumInfo}
            value={value}
            timeInfo={timeInfo}
            favouriteStyling={favouriteStyling}
            albumInfo={this.props.albumInfo}
            itemInfo={this.props.itemInfo}
          />)
        })
      }
    }


    /* Return */
    return (
      <div className="album_container">
        {/* Album Left Information */}
        <div className="album_inner_left">

          {/* Album Top Info Bar */}
          <div className="album_inner_left_heading">
            <div className="album_inner_left_heading_left"> <div className="album_art" 
            style={{ background: `url("${assets.artist.picture_medium}")`, backgroundSize: "cover", backgroundPosition: "center" }}>
              </div> 
              </div>
            <div className="album_inner_left_heading_right">
              <div className="album_inner_left_heading_right_top"> <h2 onClick={(e) => this.changeToTrackList(e)} id="artist">{assets.artist.name}</h2>
                <h1>{assets.title}</h1>
              </div>
              <div className="album_inner_left_heading_right_bottom">
                <div className=" album_inner_left_heading_right_bottom_top">
                  <i className="fa fa-heart"> {assets.fans}</i>
                  <i className="fa fa-music"> {assets.nb_tracks}</i>
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${assets.link}`}>Facebook</a>
                  <a href={`https://twitter.com/home?status=${assets.link} `}>Twitter</a>
                  <a href={`https://pinterest.com/pin/create/button/?url=${assets.link}&media=&description=`}>Pintrest</a>
                </div>
                <div className=" album_inner_left_heading_right_bottom_bottom bottom_special_align"> <p>{assets.label}</p></div>
              </div>
            </div>
          </div>

          {/* Album Track List */}
          <div className="album_inner_left_list_container">
            <div className="album_inner_left_list">
              {trackList}
            </div>

            <div className="spacer"></div>
          </div>
        </div>

        {/* Album Right Inforamtion */}
        <div className="album_inner_right">
          <div className="album_inner_right_information">
            <div className="track_art_right" style={{ background: `url("${this.props.albumInfo.cover_big}")`, backgroundSize: "cover", backgroundPosition: "top" }} ></div>
            <div className="overlap_info">
              <h5 className="title">{this.props.albumInfo.artist.name}</h5>
              <h4>{this.props.albumInfo.title}</h4>
              <div className="playback_status">
                <h5 id="title_right">
                  {this.props.playBack.trackCanPlay != "false"   ? "NOW PLAYING  " : "PAUSED  "}
                  {typeof this.props.itemInfo.musicItemTitle != 'undefined' && this.props.ready == "true" ? `${this.props.itemInfo.musicItemTitle}` : "--"}
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>


    );
  }
}


export default AlbumPortal;



