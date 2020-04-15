import React from 'react';
/* Stylesheets */
import '../css/AudioPlayer.scss';
import '../css/AudioPlayerResponsive.scss';



class AudioPlayer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }




    render(){

        return (
            <div className={typeof this.props.playBack.checkPlay != "undefined" && this.props.playBack.checkPlay != "empty" 
            ? "audio_player active" : "audio_player"} style={this.props.audioplayerStyle.audioPlayer}>
            <div className="audio_info">
              <img src={`${this.props.itemInfo.musicItemAlbumArt}`}></img>
              <div className="audio_player_titles" >
                <p className="first" style={this.props.audioplayerStyle.audioPlayerTitlesFirst}>{this.props.itemInfo.musicItemTitle}</p>
                <p className="second" style={this.props.audioplayerStyle.audioPlayerTitlesSecond} >{this.props.itemInfo.musicItemAlbum}</p>
              </div>
            </div>
            <div className="audio_skip" style={this.props.audioSkip}><i onClick={(e) => this.props.skipBackward(e)} className="fa fa-backward"></i>
              <i onClick={(e) => this.props.skipForward(e)} className="fa fa-forward"></i></div>

            <audio
              onPause={(e) => this.props.pauseSync(e)}
              id="audio"
              className="audio"
              onError={(e) => this.props.onError(e)}
              onCanPlay={(e) => this.props.onCanPlay(e)}
              onPlay={(e) => this.props.onPlay(e)}
              controls
              autoPlay
              loop
              src={this.props.itemInfo.musicItemPlay} >
            </audio>

          </div>
        )
    }
}



export default AudioPlayer;