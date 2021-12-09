import React from 'react';
import MusicInfo from './MusicInfo';
import '../css/App.scss';




class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      intro: 'true',
      characters: [],
      music_list: [],
    }

  }

  closeIntro(){
    this.setState({
      intro: 'false',
      characters: this.state.characters,
      music_list: this.state.music_list,
    })
  }


  /* RENDER */
  render() {

    /* check for unsupported screens ( < 850px, < 480px ) */
    var screenSizeUnsupportedMessage = [];
    if (window.innerWidth < 850 || window.innerHeight < 480) {
      screenSizeUnsupportedMessage.push(<div style={{
        height: "100%", width: "100%", background: "#f2f2f2", display: "flex", justifyContent: "center", alignItems: "center",
        position: "absolute", top: "0", zIndex: "10000"
      }}>
        <p style={{ fontSize: "1.2rem", color: "darkgrey", fontFamily: "Verdana" }} > Screen Size Unsupported </p>
      </div>)
    }
    else {
      screenSizeUnsupportedMessage = [];
    }


    /* return */
    return (
      <div className="container" style={{ height: `${window.innerHeight}`, width: `${window.innerWidth}` }} >
        {screenSizeUnsupportedMessage}
        <div className={this.state.intro == "true" ? "intro" : "intro remove" } >
        <p onClick={(e) => this.closeIntro(e)} style={{position: "absolute", left: "0", padding: "1rem", color: "grey"}}>Close</p>
        <div>
        <p> Welcome to Sirion Cloud, here you can search titles, explore albums, explore artist tracklists, add favourites and 
          explore genre's so be sure not to miss these cool features and explore the page for links, enjoy! </p>
        </div>
        </div>
        <MusicInfo key="" />
      </div>
    );
  }
}



export default App;



