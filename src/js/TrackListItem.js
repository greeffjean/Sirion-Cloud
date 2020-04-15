import React from 'react';
import '../css/TrackListItem.scss'





class TrackListItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  /*PLAYBACK*/
  /* Play Track */
  playTrack() {
    this.props.playTrack(this.props.value)
    this.setState({
      pause: "false"
    })
  }
  /* Pause Track */
  pauseTrack() {
    this.props.pauseTrack();
  }


  /* MISC */
  /* Change To Album Portal */
  changeToAlbum() {
    this.props.changeToAlbum(this.props.value.album.id)
  }
  /* Add to Favourite */
  addFavourite() {
    this.props.addFavourite(this.props.value)
  }


  /*  render*/
  render() {

    /* Render */
    return (
      <div className={this.props.itemInfo.musicId == this.props.value.id ? "track_item_track_list active" : "track_item_track_list"}>
        {/*(track info)*/}
        <div className="track_art" style={{ background: `url("${this.props.value.album.cover_medium}")`, backgroundSize: "contain", backgroundPosition: "center" }}></div>
        <div className="track_info_track_list">
          <div className="track_info_info">
            <h5 onClick={(e) => this.changeToAlbum()} id="artist">{this.props.value.album.title}</h5>
            <div><h4>{this.props.value.title}</h4>
              <i onClick={(e) => this.addFavourite(e)} className={this.props.favouriteStyling == "true" ? `${this.props.value.id} fa fa-heart light_up` : `${this.props.value.id} fa fa-heart`}></i>
              <span className="sec_symbol_attr">&#x27F3; </span>
              <span className="sec_attr">{this.props.timeInfo.getMinutes}:{this.props.timeInfo.getSeconds} </span>

            </div>
          </div>

          {/*(playback interface)*/}
          <div id={this.props.value.id} className="play_pause_track_list">
            <i onClick={(e) => this.playTrack(e)}
              className={this.props.playBack.checkPlay == "true" && this.props.itemInfo.musicId == this.props.value.id ? "fa fa-play play_track_list disable" : "fa fa-play play_track_list"}>
            </i>
            <i onClick={(e) => this.pauseTrack(e)}
              className={this.props.playBack.checkPause == "false" && this.props.itemInfo.musicId == this.props.value.id ? "fa fa-pause pause_track_list active" : "fa fa-pause pause_track_list"}></i>
          </div>
        </div>
      </div>

    );
  }
}



export default TrackListItem;



