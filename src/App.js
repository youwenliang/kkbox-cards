import React, { Component } from 'react';
import {Palette, usePalette} from 'react-palette';
import './App.css';
import logo from './images/logo.png';
import search from './images/ic_search_24.svg';
import question from './images/ic_faq_20.svg';
import $ from 'jquery';

var type = {
  'artist': '歌手',
  'track': '歌曲',
  'album': '專輯',
}

let cardImage = [];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      keyword: '',
      type: 'artist',
      current: [],
      cardType: '',
      url:'',
      colors: []
    };
    this.selectCard = this.selectCard.bind(this);
    this.updateCard = this.updateCard.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onTypeChange = this.onTypeChange.bind(this);
    this.getInputValue = this.getInputValue.bind(this);
    this.getInfo = this.getInfo.bind(this);
  }

  componentDidUpdate() {
    
  }

  selectCard(event, i) {
    this.setState({current: i}, this.updateCard);
    $('.active').removeClass('active');
    event.target.classList.add('active');
  }

  updateCard() {
    var url = (this.state.current.images === undefined) ? this.state.current.album.images[1].url : this.state.current.images[1].url;
    this.setState({url: url});
    cardImage = (<img src={url} width="300"/>);
    // $('main').css({'background-color': data.vibrant});
    this.forceUpdate();
  }

  onTypeChange(event) {
    this.setState({
      type: event.target.value
    });
    if(this.state.keyword.length > 1) this.getInputValue();
  }

  onInputChange(event) {
    this.setState({
      keyword: event.target.value
    });
    if(this.state.keyword.length > 1) this.getInputValue();
  }

  getInputValue() {
    // event.preventDefault();
    var keyword = document.getElementById("input").value;
    var type = document.querySelector('input[name="type"]:checked').value;
    this.setState({keyword: keyword, type: type});
    this.getInfo(keyword, type);
  }

  getInfo(keyword, type) {
    $('#results').addClass('hide');
    fetch('https://api.kkbox.com/v1.1/search?q='+keyword+'&type='+type+'&territory=TW&offset=0&limit=10', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        authorization: 'Bearer F5MKSIpHAt9ukR7tWo9vdg==',
      },
    })
      .then(res => res.json())
      .then(
        (result) => {
          if(!result.error) {
            var $t = this;
            setTimeout(function(){
              $t.setState({
                isLoaded: true,
                items: result[type+'s'].data,
                cardType: type
              });
              console.log(result)
              $('#results').removeClass('hide');
            },100)
          }
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render() {
    const { error, isLoaded, items } = this.state;
    let result = [];

    if (error) {
      result = (<div>Error: {error.message}</div>);
    } else if (!isLoaded) {
      result = (
        <div className="tc mt5">
          <img src={search} width="75" alt="search"/>
          <h2 className="near-black">請輸入關鍵字</h2>
          <p className="light-silver">搜尋歌手、專輯、歌曲</p>
        </div>);
    } else {
      result = items.length > 1 ? (
        <div id="results">
          {items.map(item => (
            <div key={item.id} className="card flex items-center pa3 mv2 br3 mr3" onClick={(e) => this.selectCard(e, item)}>
              <img alt="cover" className="br2" src={(item.images === undefined) ? item.album.images[0].url : item.images[0].url} width="80" />
              <div className="dib ph3">
                <p className="primary ma0">{item.name}</p>
                <p className="secondary ma0">{type[this.state.cardType]}</p>
              </div>
            </div>
          ))}
        </div>
      ):(
        <div className="tc mt5">
          <img src={question} width="75" alt="no results"/>
          <h2 className="near-black">無搜尋結果</h2>
          <p className="light-silver">嘗試其他搜尋分類或調整關鍵字內容</p>
        </div>
      )
    }

    return (
      <main>
        <section id="canvas" className="flex justify-center items-center">
          <div id="card" className="pa5 br3">
            {cardImage}
          </div>
          <FindColor url={this.state.url}/>
        </section>
        <section id="side" className="flex flex-column bg-white vh-100">
          <div className="center mv4">
            <img src={logo} width="166" alt="KKBOX"/>
          </div>
          <form action="javascript:void(0);" className="bb b--black-30">
            <div className="ph4 relative">
              <input id="input" className="db pa2 mb4 w-100" type="text" placeholder="輸入關鍵字搜尋" autoComplete="off" onChange={this.onInputChange}/>
              <img src={search} width="24" className="absolute" alt="search"/>
            </div>
            <div className="flex justify-between">
              <div className="w-third">
                <input type="radio" id="artist" name="type" value="artist" onChange={this.onTypeChange} checked={this.state.type === "artist"}/>
                <label htmlFor="artist" className="w-100 tc">歌手</label>
              </div>
              <div className="w-third">
                <input type="radio" id="album" name="type" value="album" onChange={this.onTypeChange} checked={this.state.type === "album"}/>
                <label htmlFor="album" className="w-100 tc">專輯</label>
              </div>
              <div className="w-third">
                <input type="radio" id="track" name="type" value="track" onChange={this.onTypeChange} checked={this.state.type === "track"}/>
                <label htmlFor="track" className="w-100 tc">歌曲</label>
              </div>
            </div>
          </form>
          <div className="overflow-y-scroll overflow-x-hidden pl3 pv2">
            {result}
          </div>
        </section>
      </main>
    )
  }
}
export default App;


function FindColor(props) {
  const { data, loading, error } = usePalette(props.url)
  $('main').css({'background-color': data.darkVibrant});
  $('#card').css({'background-color': data.vibrant});
  return true;
}
