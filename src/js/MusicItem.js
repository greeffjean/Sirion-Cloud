import React from 'react';
import '../css/MusicItem.css';




class Musicitem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  /* PLAYBACK*/
  /* Play Song*/
  playSong() {
    console.log(this.props.info)
    var track = this.props.info.preview;
    var album = this.props.info.album.title;
    var title = this.props.info.title_short;
    var album_art = this.props.info.album.cover_small;
    if(!this.props.info.album.cover_small) {
      album_art = this.props.info.album.cover_big
    }
    var id = this.props.selector;
    this.props.playSong(track, album, title, album_art, id);
    this.setState({
      active: "true"
    })
  }

  /* Pause Song*/
  pauseSong() {
    this.props.pauseSong()
    this.setState({
      pause: "true"
    })
  }

  /* MISC */
  /* Add To Favourites*/
  addFavourites(val) {
    var condition = [];
    this.state.favourite == "true" ? condition = "false" : condition = "true"
    this.props.addFavourites(val)
    this.setState({
      favourites: val.id,
      favourite: condition
    })
  }


  /*  Change To Album */
  changeToAlbum() {
    this.props.changeToAlbum(this.props.info.album.id)
  }


  /*  render*/
  render() {


    /* Render */
    return (

      <div className="item_container">
        <div className='item_wrapper'>

          {/* top item section */}
          <div className='section_top'>
            <div style={{ background: `url(${this.props.info.album.cover_big})`, backgroundSize: 'cover', backgroundPosition: "center" }} className="section_top_inner">
              <div className={this.props.selector == this.props.music_id
                || this.props.skip_active == "true" && this.props.selector == this.props.music_id ? "play_song active" : "play_song"}>
                <i onClick={(e) => this.playSong(e)}
                  className={this.props.check_play == "true" && this.props.selector == this.props.music_id ? "fa fa-play play control_change" : "fa fa-play play "}></i>
                <i onClick={(e) => this.pauseSong(e)}
                  className={this.props.check_play == "true" && this.props.selector == this.props.music_id ? "fa fa-pause pause control_change" : "fa fa-pause pause"}></i>
              </div>
            </div>
          </div>

          {/* bottom item section */}
          <div className='section_bottom'>
            <div className='bottom_left'>
              <h4>{this.props.info.title}</h4>
              <h5 onClick={(e) => this.changeToAlbum(e)}>{this.props.info.album.title}</h5>
            </div>
            <div className='bottom_right'>
              <i className={this.props.favourite_styling == "true" ? "fa fa-heart light_up" : " fa fa-heart"}
                onClick={(e) => this.addFavourites(this.props.info)} ></i>
            </div>
          </div>
        </div>
      </div>

    );
  }
}



export default Musicitem;



