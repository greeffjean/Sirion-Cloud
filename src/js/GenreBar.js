import React from 'react';
import '../css/GenreBar.scss'



class GenreBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  

  /* Render*/
  render() {

    /* Return */
    return (
        <div className="genre_bar">
        <div className='genre_bar_param'>
          <div className="genre_item" onClick={(e) => this.props.searchPlayList(3220851222)} > Brazilian <div className="genre_bar_item_border"></div> </div>
          <div className="genre_item" onClick={(e) => this.props.searchPlayList(1615514485)} > Jazz <div className="genre_bar_item_border"></div> </div>
          <div className="genre_item" onClick={(e) => this.props.searchPlayList(735488796)} > Indie <div className="genre_bar_item_border"></div> </div>
          <div className="genre_item" onClick={(e) => this.props.searchPlayList(1767932902)} > Blues <div className="genre_bar_item_border"></div> </div>
          <div className="genre_item" onClick={(e) => this.props.searchPlayList(4485213484)} > Soul <div className="genre_bar_item_border"></div> </div>
          <div className="genre_item" onClick={(e) => this.props.searchPlayList(2113355604)} > Dance <div className="genre_bar_item_border"></div> </div>
          <div className="genre_item" onClick={(e) => this.props.searchPlayList(1283464975)} > Pop <div className="genre_bar_item_border"></div> </div>
          <div className="genre_item" onClick={(e) => this.props.searchPlayList(3801761042)} > Electronic <div className="genre_bar_item_border"></div> </div>
          <div className={this.props.favourites.length != 0 ? "genre_item_heart active" : "genre_item_heart"}
            onClick={(e) => this.props.changeToFavourites(e)} > <i className="fa fa-heart"></i>
            <div className="genre_bar_item_border"></div>
          </div>
        </div>
      </div>
    )

  }
}


export default GenreBar;



