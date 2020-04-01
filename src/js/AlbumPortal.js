import React from 'react';
import '../css/AlbumPortal.css';
import AlbumItem from './AlbumItem'




class AlbumPortal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  /*PLAYBACK*/
  /* Play Track */
  playTrack(value, assets) {
    this.props.playTrack(value, assets)
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
  /* Change To Artist Portal */
  changeToTrackList() {
    this.props.changeToTrackList(this.props.album_info.artist.name)
  }
  /* Reset */
  resetState() {
    this.props.reset_State()
  }




  /* Render */
  render() {

    /* Render Album List Items */
    if (this.props.album_info != []) {
      var assets = this.props.album_info;
      var track_list = [];
      if (this.props.album_info.tracks.data) {
        this.props.album_info.tracks.data.map(value => {

          /* Styling and Time Formating of Track Info */
          var favourite_styling = [];
          var get_minutes = Math.floor(value.duration / 60);
          var sum = get_minutes * 60;
          var get_seconds = value.duration - sum;
          var time_info = {
            get_minutes: get_minutes,
            sum: sum,
            get_seconds: get_seconds,
          }
          if (time_info.get_seconds.toString().length === 1) {
            time_info.get_seconds = "0" + time_info.get_seconds.toString();
          }

          /* Searching For Selected Favourites - applying correct styling */
          this.props.favourite_log.map(val => {
            if (val == value.id) {
              favourite_styling = true
            }
          })

          /* Adding New List Items */
          track_list.push(<AlbumItem
            /*PlayBack*/
            check_play={this.props.check_play}
            check_pause={this.props.check_pause}
            /*Functions*/
            playTrack={(value, assets) => this.playTrack(value, assets)}
            pauseTrack={(e) => this.pauseTrack(e)}
            addFavourite={(value) => this.addFavourite(value)}
            changeToTrackList={(e) => this.changeToTrackList(e)}
            /*Info*/
            key={value.id}
            assets={this.props.album_info}
            value={value}
            time_info={time_info}
            favourite_styling={favourite_styling}
            album_info={this.props.album_info}
            music_id={this.props.music_id}


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
            <div className="album_inner_left_heading_left"> <div className="album_art" style={{ background: `url("${assets.artist.picture_medium}")`, backgroundSize: "cover", backgroundPosition: "center" }}></div> </div>
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
              {track_list}
            </div>

            <div className="spacer"></div>
          </div>
        </div>

        {/* Album Right Inforamtion */}
        <div className="album_inner_right">
          <div className="album_inner_right_information">
            <div className="track_art_right" style={{ background: `url("${this.props.album_info.cover_big}")`, backgroundSize: "cover", backgroundPosition: "top" }} ></div>
            <div className="overlap_info">
              <h5 className="title">{this.props.album_info.artist.name}</h5>
              <h4>{this.props.album_info.title}</h4>
              <div className="playback_status" >
                <h5 id="title_right">
                  {this.state.pause != "true" ? "NOW PLAYING  " : "PAUSED  "}
                  {typeof this.props.current_music_item_title != 'undefined' && this.props.album_ready == "true" ? `${this.props.current_music_item_title}` : "--"}
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



