import React, { Component } from 'react';
// eslint-disable-next-line  no-unused-vars 
import {Palette, usePalette} from 'react-palette';
import Tilty from 'react-tilty';
import './App.css';
import logo from './images/logo.png';
import mono from './images/mono.png';
import pattern from './images/pattern.png';
import search from './images/ic_search_24.svg';
import check from './images/ic_check_24.png';
import $ from 'jquery';
import html2canvas from 'html2canvas';
import ReactTooltip from 'react-tooltip';
import searchStatus from './images/search.png';
import emptyStatus from './images/empty.png';

var type = {
  'artist': '歌手',
  'track': '歌曲',
  'album': '專輯',
}

let cardImage = (<img crossOrigin="anonymous" src="https://placehold.co/600" width="100%" className="mw-400" alt="cover"/>);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      selected: false,
      items: [],
      keyword: '',
      type: 'artist',
      current: [],
      currentType: '',
      cardType: '',
      url:'',
      colors: [],
      text1: '',
      text2: '',
      style: 'style0'
    };

    this.nextPage = this.nextPage.bind(this);
    this.showSearch = this.showSearch.bind(this);
    
    this.onTypeChange = this.onTypeChange.bind(this);
    this.onStyleChange = this.onStyleChange.bind(this);
    this.onTyping = this.onTyping.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.getInputValue = this.getInputValue.bind(this);
    this.getInfo = this.getInfo.bind(this);

    this.copyURL = this.copyURL.bind(this);
    this.saveImage = this.saveImage.bind(this);

    this.selectCard = this.selectCard.bind(this);
    this.updateCard = this.updateCard.bind(this);
  }

  componentDidUpdate() {
  }

  // Custom Functions

  nextPage() {
    $('#home').css({'opacity': 0, 'pointer-events':'none'});
    $('#side').removeClass('reset');
  }

  showSearch() {
    $('#canvas, #searchBtn').addClass('hide');
    $('#side').removeClass('hide');
  }

  copyURL() {
    var copyText = document.getElementById("url");
    copyText.select();
    copyText.setSelectionRange(0, 99999); /* For mobile devices */
    navigator.clipboard.writeText(copyText.value);
    $('#check').addClass('show');
    setTimeout(function(){
      $('#check').removeClass('show');
    },3000)
  }

  saveImage() {
    var win = window.open();
    html2canvas(document.querySelector('#card'), {
      backgroundColor: "rgba(0,0,0,0)",
      allowTaint: true,
      useCORS: true
    }).then(function(canvas){    
        win.document.write("<img width='100%' style='max-width:400px' crossOrigin='anonymous' src='" + canvas.toDataURL()+"'/>");
    });
  }

  selectCard(event, i) {
    this.setState({current: i, currentType: this.state.type, selected: true}, this.updateCard);
    $('.active').removeClass('active');
    event.target.classList.add('active');
    $('#canvas, #searchBtn').removeClass('hide');
    $('#side').addClass('hide');
  }

  updateCard() {
    var url = (this.state.current.images === undefined) ? this.state.current.album.images[1].url : this.state.current.images[1].url;
    this.setState({url: url});
    cardImage = (<img crossOrigin="anonymous" src={url} width="100%" className="mw-300" alt="cover"/>);
    // $('main').css({'background-color': data.vibrant});
    this.forceUpdate();
  }

  onTypeChange(event) {
    this.setState({
      type: event.target.value
    });
    if(this.state.keyword.length > 1) this.getInputValue();    
  }

  onStyleChange(event) {
    this.setState({
      style: event.target.value
    }, () => {
      console.log(this.state.style);
    });
  }

  onTyping(key, event) {
    var $t = this;
    if(key === 0) {
      $t.setState({
        text1: event.target.value
      }, () => {
          $('#text1').html($t.state.text1);
      });
      
    } else {
      $t.setState({
        text2: event.target.value
      }, () => {
          $('#text2').html($t.state.text2);
      });
    }
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
    fetch('https://api.kkbox.com/v1.1/search?q='+keyword+'&type='+type+'&territory=TW&offset=0&limit=20', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        authorization: 'Bearer Ep86pr_Jl8ofhoZxChaXhQ==',
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
          <img src={searchStatus} width="200" alt="search"/>
          <h2 className="near-white mt0">請輸入關鍵字</h2>
          <p className="light-silver">搜尋歌手、專輯或歌曲</p>
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
          <img src={emptyStatus} width="200" alt="no results"/>
          <h2 className="near-white mt0">無搜尋結果</h2>
          <p className="light-silver">嘗試搜尋其他分類，或調整關鍵字內容</p>
        </div>
      )
    }

    var patternImg = {
      backgroundImage: 'url('+pattern+')',
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
      // width: '100%',
      // height: '100%',
      // position: 'absolute',
      // top: 0,
      // left: 0
    }

    let addName = null;
    if(this.state.selected) {
      if(this.state.currentType === 'track') addName = (<p className="mt2 mb0 f5 o-90">{this.state.current.album.artist.name}</p>)
      else if(this.state.currentType === 'album') addName = (<p className="mt2 mb0 f5 o-90">{this.state.current.artist.name}</p>)
    }

    // 三種卡片風格
    var card = {
      "style0" : (
      <Tilty 
        maxTilt={2}
        perspective={1400}
        easing="cubic-bezier(.03,.98,.52,.99)"
        speed={1200}
        scale={1.05}
        glare={false}
        maxGlare={0.8}
      >
        <div id="card" className="pa5 br3" data-tilt style={patternImg}>
          <img id="mono" className="z-1" src={mono} width="30" alt="KKBOX" />
          <div id="mask" className="pa4 near-white flex items-start flex-column justify-end">
            <h1 id="text1" className="mv2 f3">{this.state.current.name ? this.state.current.name.split('(')[0] : null}</h1>
            <p id="text2" className="mv0 f6 o-70">{type[this.state.currentType]+' / '+this.state.currentType.substring(0,1).toUpperCase()+this.state.currentType.substring(1)}</p>
            {addName}
          </div>
          {cardImage}
          <div id="pattern" style={patternImg}></div>
        </div>
      </Tilty>
      ),
      "style1" : (
      <Tilty 
        maxTilt={2}
        perspective={1400}
        easing="cubic-bezier(.03,.98,.52,.99)"
        speed={1200}
        scale={1.05}
        glare={true}
        maxGlare={0.8}
      >
        <div id="card" className="pa5 br3" data-tilt style={patternImg}>
          <img id="mono" src={mono} width="30" alt="KKBOX" />
          <div id="mask" className="pa4 near-white flex items-start flex-column justify-end">
            <h1 id="text1" className="mv2 f3">{this.state.current.name ? this.state.current.name.split('(')[0] : null}</h1>
            <p id="text2" className="mv0 f6 o-70">{type[this.state.currentType]+' / '+this.state.currentType.substring(0,1).toUpperCase()+this.state.currentType.substring(1)}</p>
            {addName}
          </div>
          {cardImage}
          <div id="pattern" style={patternImg}></div>
        </div>
      </Tilty>
      ),
      "style2" : (
      <Tilty 
        maxTilt={2}
        perspective={1400}
        easing="cubic-bezier(.03,.98,.52,.99)"
        speed={1200}
        scale={1.05}
        glare={false}
        maxGlare={0.8}
      >
        <div id="card" className="pa5 br3" data-tilt style={patternImg}>
          <img id="mono" src={mono} width="30" alt="KKBOX" />
          <div id="mask" className="pa4 near-white flex items-start flex-column justify-end">
            <h1 id="text1" className="mv2 f3">{this.state.current.name ? this.state.current.name.split('(')[0] : null}</h1>
            <p id="text2" className="mv0 f6 o-70">{type[this.state.currentType]+' / '+this.state.currentType.substring(0,1).toUpperCase()+this.state.currentType.substring(1)}</p>
            {addName}
          </div>
          {cardImage}
          <div id="pattern" style={patternImg}></div>
        </div>
      </Tilty>
      )
    }

    return (
      <main>
        <div id="home" className="absolute top0 left0 vh-100 w-100 flex bg-near-black flex-column justify-center items-center z-2">
          <h1 className="near-white">最偉大的作品</h1>
          <button className="db flex items-center justify-center fw5 h40 flex-shrink-0 black primaryBtn" onClick={this.nextPage}>開始製作</button>
        </div>
        <section id="canvas" className="flex justify-center items-center flex-column ph3 hide">
          <div id="maskBG" className="o-20 w-100 h-100 absolute"></div>
          <div className="w-100 mb4-l mb3 z-1">
            <form className="flex flex-row justify-center mb3">
              <label className="labl">
                <input id="style0" aria-label="style0" type="radio" name="style" value="style0" onChange={this.onStyleChange} checked={this.state.style === "style0"}/>
                <div data-tip="風格一" htmlfor="style0" id="c1" className="cp circle br3 bg-near-white"></div>
              </label>
              <label className="labl">
                <input id="style1" aria-label="style1" type="radio" name="style" value="style1" onChange={this.onStyleChange} checked={this.state.style === "style1"}/>
                <div data-tip="風格二" htmlfor="style1" id="c2" className="cp circle br3 bg-near-white"></div>
              </label>
              <label className="labl">
                <input id="style2" aria-label="style2" type="radio" name="style" value="style2" onChange={this.onStyleChange} checked={this.state.style === "style2"}/>
                <div data-tip="風格三" htmlfor="style2" id="c3" className="cp circle br3 bg-near-white"></div>
              </label>
            </form>
          </div>
          {card[this.state.style]}
          <FindColor url={this.state.url}/>
          <div className="controls mt4-l mt3 mw-400 z-1 f6">
            <form>
              <div className="mv3 flex items-center flex-row">
                <label className="near-white pr3">標題</label>
                <input aria-label="title" type="text" className="textbox flex-grow-1 h40 o-80" placeholder="輸入標題" onChange={(e) => this.onTyping(0, e)}/>
              </div>
              <div className="mv3 flex items-center flex-row">
                <label className="near-white pr3 mv2">內文</label>
                <input aria-label="content" type="text" className="textbox flex-grow-1 h40 o-80" placeholder="輸入內文" onChange={(e) => this.onTyping(1, e)}/>
              </div>
            </form>
          </div>
          <div className="controls w-100 mw-400 flex flex-row items-center relative z-1 f6">
            <label className="near-white pr3 mv2 flex-shrink-0">分享</label>
            <input aria-label="url" data-tip={"複製"+type[this.state.cardType]+"連結"} className="flex-grow-1 cp textbox h40 o-80" id="url" type="text" value={this.state.current.url} readOnly="readonly" onClick={this.copyURL}></input>
            <img id="check" src={check} width="24" className="absolute" alt="check"/>
            <button className="db ml3 flex items-center justify-center fw5 h40 flex-shrink-0 black secondaryBtn" id="save" onClick={this.saveImage}>下載圖片</button>
          </div>
          <ReactTooltip />
        </section>
        <div id="searchBtn" className="absolute hide cp" onClick={this.showSearch}>
          <img src={search} width="32" alt="search"/>
        </div>
        <section id="side" className="flex flex-column bg-dark-gray vh-100 z-1 reset">
          <div className="center mv4">
            <a href="."><img src={logo} width="120" alt="KKCards"/></a>
          </div>
          <form action='javascript:void(0);' className="bb b--white-40">
            <div className="ph4 relative">
              <input aria-label="search" id="input" className="db pa2 mb4 w-100 near-white" type="text" placeholder="輸入關鍵字搜尋" autoComplete="off" onChange={this.onInputChange}/>
              <img src={search} width="24" className="absolute" alt="search"/>
            </div>
            <div className="flex justify-between">
              <div className="w-third">
                <input aria-label="artist" type="radio" id="artist" name="type" value="artist" onChange={this.onTypeChange} checked={this.state.type === "artist"}/>
                <label htmlFor="artist" className="w-100 tc">歌手</label>
              </div>
              <div className="w-third">
                <input aria-label="album" type="radio" id="album" name="type" value="album" onChange={this.onTypeChange} checked={this.state.type === "album"}/>
                <label htmlFor="album" className="w-100 tc">專輯</label>
              </div>
              <div className="w-third">
                <input aria-label="track" type="radio" id="track" name="type" value="track" onChange={this.onTypeChange} checked={this.state.type === "track"}/>
                <label htmlFor="track" className="w-100 tc">歌曲</label>
              </div>
            </div>
          </form>
          <div className="overflow-y-scroll overflow-x-hidden pl3 pv2">
            {result}
          </div>
          <div id="tab"></div>
        </section>
      </main>
    )
  }
}
export default App;


function FindColor(props) {
  // eslint-disable-next-line  no-unused-vars 
  const { data, loading, error } = usePalette(props.url);
  $('main').css({'background-color': data.darkMuted});
  $('#maskBG').css({
    'backgroundImage': 'url(' + props.url + ')',
    'backgroundSize': 'cover',
    'backgroundPosition': 'center center',
    'filter': 'blur(1.5rem)',
    'pointerEvents': 'none'
  })
  $('#card').css({'background-color': data.darkVibrant});
  $('#c1').css({'background-color': data.lightMuted});
  $('#c2').css({'background-color': data.muted});
  $('#c3').css({'background-color': data.darkMuted});
  $('#mask').css({'background':'linear-gradient(15deg, '+data.darkVibrant+' 0%, '+data.darkVibrant+'00 75% 100%)'})
  return true;
}
