import React from 'react';
import MusicInfo from './MusicInfo';
import MusicDatabase from './MuiscDatabase';
import '../css/App.css';




class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      characters: [],
      music_list: [],
    }

  }


  /* RENDER */
  render() {

    /* check for unsupported screens ( < 850px, < 480px ) */
    var screen_size_unsupported_message = [];
    if (window.innerWidth < 850 || window.innerHeight < 480) {
      screen_size_unsupported_message.push(<div style={{
        height: "100%", width: "100%", background: "#f2f2f2", display: "flex", justifyContent: "center", alignItems: "center",
        position: "absolute", top: "0", zIndex: "10000"
      }}>
        <p style={{ fontSize: "1.2rem", color: "darkgrey", fontFamily: "Verdana" }} > Screen Size Unsupported </p>
      </div>)
    }
    else {
      screen_size_unsupported_message = [];
    }


    /* return */
    return (
      <div className="container" style={{ height: `${window.innerHeight}`, width: `${window.innerWidth}` }} >
        {screen_size_unsupported_message}
        <MusicInfo key="" />
      </div>
    );
  }
}



export default App;



