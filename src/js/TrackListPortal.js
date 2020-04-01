import React from 'react';
import '../css/TrackListPortal.css';
import TrackListItem from './TrackListItem'




class TrackListPortal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
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
    this.props.changeToAlbum(this.props.album_change_back.id)
  }

  /* Change To Artist Portal */
  moreTracks() {
    this.props.moreTracks(this.props.track_list_artist[0].artist.name)
  }


  /* Render */
  render() {
    if (this.props.track_list_ready === "true") {
      /* Render TrackList List Items */
      if (this.props.track_list_ready === "true") {
        var track_list = [];
        this.props.track_list_artist.map(value => {

          /* Process data and output correct styling and format of time and favourite icon */
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
              favourite_styling = "true"
            }
          })

          /* Adding New List Items */
          track_list.push(<TrackListItem
            /*PlayBack*/
            check_play={this.props.check_play}
            check_pause={this.props.check_pause}
            /*Functions*/
            addFavourite={(value) => this.addFavourite(value)}
            changeToAlbum={(id) => this.changeToAlbum(id)}
            playTrack={(value) => this.playTrack(value)}
            pauseTrack={(e) => this.pauseTrack(e)}
            /*Info*/
            key={value.id}
            value={value}
            time_info={time_info}
            favourite_styling={favourite_styling}
            album_info={this.props.album_Info}
            music_id={this.props.music_id}
          />)
        })
      }

      /* Render Default Right Track Info */
      var current_track = [];

      /* Render Right Track Info Data */
      this.props.track_list_artist.map(value => {
        if (value.id === this.props.music_id) {
          current_track.push(value)
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
            <div className="track_list_inner_left_heading_left"> <div className="track_list_art"
              style={{ background: `url("${this.props.track_list_artist[0].artist.picture_medium}")`, backgroundSize: "cover", backgroundPosition: "center" }} >
            </div>
            </div>
            <div className="track_list_inner_left_heading_right">
              <div className="track_list_inner_left_heading_right_top"> <h2>{this.props.track_list_artist[0].artist.name}</h2> <h1>Track List</h1></div>
              <div className="track_list_inner_left_heading_right_bottom">
                <div className=" track_list_inner_left_heading_right_bottom_top">
                  <i className="fa fa-music"> {this.props.track_list_info.total}</i>
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=https://www.deezer.com/en/artist/${this.props.track_list_artist[0].artist.id}`}>Facebook</a>
                  <a href={`https://twitter.com/home?status=https://www.deezer.com/en/artist/${this.props.track_list_artist[0].artist.id} `}>Twitter</a>
                  <a href={`https://pinterest.com/pin/create/button/?url=https://www.deezer.com/en/artist/${this.props.track_list_artist[0].artist.id}&media=&description=`}>Pintrest</a>
                </div>
                <div onClick={(e) => this.changeBackToAlbum(e)} className=" track_list_inner_left_heading_right_bottom_bottom bottom_special_align">
                  <p>Return to {this.props.album_change_back.title}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Track List Track List */}
          <div className="track_list_inner_left_list_container">
            <div className="track_list_inner_left_list">
              {track_list}
            </div>

            <div className="spacer">
              <p onClick={(e) => this.moreTracks(e)}>+</p>

            </div>
          </div>
        </div>

        {/* Track List Right Inforamtion */}
        <div className="track_list_inner_right">
          <div className="track_list_inner_right_information">
            <div className="track_list_art_right"> <img src={current_track.length > 0 ? `${current_track[0].album.cover_big}` : `${this.props.track_list_artist[0].artist.picture_big}`}></img> </div>;
            <div className="overlap_info">
              <h5 className="title">{current_track.length > 0 ? current_track[0].title : "--"}</h5>
              <h4>{current_track.length > 0 ? current_track[0].album.title : "--"}</h4>
              <div className="playback_status">
                <h5 id="title_right">
                  {this.state.pause != "true" ? "NOW PLAYING  " : "PAUSED  "}
                  {typeof this.props.current_music_item_title != "undefined" ? `${this.props.current_music_item_title}` : `--`}
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



