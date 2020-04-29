import React from 'react';
import '../css/AlbumItem.scss'


class AlbumItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  /*PLAYBACK*/
  /* Play Track */
  playTrack() {
    this.props.playTrack(this.props.value, this.props.assets)
  }
  /* Pause Track */
  pauseTrack() {
    this.props.pauseTrack();
  }


  /* MISC */
  /* Change To Artist Portal */
  changeToTrackList() {
    this.props.changeToTrackList()
  }

  /* Add to Favourite */
  addFavourite() {
    /* add title and album_art to object */
    var obj = this.props.value;
    obj.album = { cover_big: {}, title: {} };
    obj.album.cover_small = this.props.albumInfo.cover_big;
    obj.album.title = this.props.albumInfo.title;
    obj.album.id = this.props.albumInfo.id;
    this.props.addFavourite(obj)
  }



  /* Render*/
  render() {

    /* Return */
    return (

      <div className={this.props.itemInfo.musicId == this.props.value.id ? "track_item_album active" : "track_item_album"}>
        {/*(track info)*/}
        <div className="track_art_album" style={{ background: `url(${this.props.assets.cover_medium})`, backgroundSize: "cover" }}></div>
        <div className="track_info">
          <div className="track_info_info">
            <h5 onClick={(e) => this.changeToTrackList(e)} id="artist">{this.props.assets.artist.name}</h5>
            <div>
              <h4>{this.props.value.title}</h4>
              <i onClick={(e) => this.addFavourite(this.props.value)} 
              className={this.props.favouriteStyling == true ? `${this.props.value.id} fa fa-heart light_up` : `${this.props.value.id} fa fa-heart`}>
              </i>
              <span className="sec_symbol_attr">&#x27F3; </span>
              <span className="sec_attr">{this.props.timeInfo.getMinutes}:{this.props.timeInfo.getSeconds} </span>
            </div>
          </div>

          {/*(playback interface)*/}
          <div id={this.props.value.id} className="play_pause_album">
            <i
              onClick={(e) => this.playTrack(e)}
              className={this.props.playBack.checkPlay == "true" && this.props.itemInfo.musicId == this.props.value.id ? "fa fa-play play_album disable" : "fa fa-play play_album"}>
            </i>
            <i
              onClick={(e) => this.pauseTrack(e)}
              className={this.props.playBack.checkPause == "false" && this.props.itemInfo.musicId == this.props.value.id ? "fa fa-pause pause_album active" : "fa fa-pause pause_album"}>
            </i>
          </div>
        </div>
      </div>
    )

  }
}


export default AlbumItem;



