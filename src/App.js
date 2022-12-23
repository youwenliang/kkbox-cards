import React, { Component } from 'react';
import {Palette, usePalette} from 'react-palette';
import Tilty from 'react-tilty';
import './App.css';
import logo from './images/logo.png';
import mono from './images/mono.png';
import pattern from './images/pattern.png';
import search from './images/ic_search_24.svg';
import check from './images/ic_check_24.png';
import question from './images/ic_faq_20.svg';
import $ from 'jquery';
import html2canvas from 'html2canvas';
import ReactTooltip from 'react-tooltip';

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
    this.onTyping = this.onTyping.bind(this);
    this.saveImage = this.saveImage.bind(this);
    this.selectCard = this.selectCard.bind(this);
    this.updateCard = this.updateCard.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onTypeChange = this.onTypeChange.bind(this);
    this.onStyleChange = this.onStyleChange.bind(this);
    this.getInputValue = this.getInputValue.bind(this);
    this.getInfo = this.getInfo.bind(this);
    this.copyURL = this.copyURL.bind(this);
  }

  componentDidUpdate() {
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

  nextPage() {
    $('#home').css({'opacity': 0, 'pointer-events':'none'});
  }

  saveImage() {
    var $t = this;
    html2canvas(document.querySelector('#card'), {
      allowTaint: true,
      useCORS: true
    }).then(function(canvas){    
        var win = window.open();
        win.document.write("<a href='"+ canvas.toDataURL() +"' download = 'kkbox_"+$t.state.current.name+".png'><img crossOrigin='anonymous' src='" + canvas.toDataURL()+"'/>");
    });
  }

  selectCard(event, i) {
    this.setState({current: i, currentType: this.state.type, selected: true}, this.updateCard);
    $('.active').removeClass('active');
    event.target.classList.add('active');
    $('#canvas').removeClass('hide');
  }

  updateCard() {
    var url = (this.state.current.images === undefined) ? this.state.current.album.images[1].url : this.state.current.images[1].url;
    this.setState({url: url});
    cardImage = (<img crossOrigin="anonymous" src={url} width="300" alt="cover"/>);
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
    fetch('https://api.kkbox.com/v1.1/search?q='+keyword+'&type='+type+'&territory=TW&offset=0&limit=10', {
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
          <img src={search} width="75" alt="search"/>
          <h2 className="near-white">請輸入關鍵字</h2>
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
          <h2 className="near-white">無搜尋結果</h2>
          <p className="light-silver">嘗試其他搜尋分類或調整關鍵字內容</p>
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
        <div id="home" className="absolute top0 left0 vh-100 w-100 flex bg-dark-gray flex-column justify-center items-center z-2">
          <h1>最偉大的作品</h1>
          <button onClick={this.nextPage}>開始製作</button>
        </div>
        <section id="canvas" className="flex justify-center items-center flex-column hide">
          <div id="maskBG" className="o-20 w-100 h-100 absolute"></div>
          <div className="w-100 mb5 z-1">
            <form className="flex flex-row justify-center">
              <label className="labl">
                <input id="style0" type="radio" name="style" value="style0" onChange={this.onStyleChange} checked={this.state.style === "style0"}/>
                <div htmlfor="style0" className="cp circle br3 bg-near-white"></div>
              </label>
              <label className="labl">
                <input id="style1" type="radio" name="style" value="style1" onChange={this.onStyleChange} checked={this.state.style === "style1"}/>
                <div htmlfor="style1" className="cp circle br3 bg-near-white"></div>
              </label>
              <label className="labl">
                <input id="style2" type="radio" name="style" value="style2" onChange={this.onStyleChange} checked={this.state.style === "style2"}/>
                <div htmlfor="style2" className="cp circle br3 bg-near-white"></div>
              </label>
            </form>
          </div>
          {card[this.state.style]}
          <FindColor url={this.state.url}/>
          <div className="mt5 mw-400 z-1">
            <form>
              <div className="mv3 flex items-center flex-row">
                <label className="near-white pr3">標題</label>
                <input type="text" className="textbox flex-grow-1" placeholder="輸入標題" onChange={(e) => this.onTyping(0, e)}/>
              </div>
              <div className="mv3 flex items-center flex-row">
                <label className="near-white pr3 mv2">內文</label>
                <input type="text" className="textbox flex-grow-1" placeholder="輸入內文" onChange={(e) => this.onTyping(1, e)}/>
              </div>
            </form>
          </div>
          <div className="w-third flex flex-row mt5 f6 relative h48 z-1">
            <input data-tip="複製連結" className="w-100 cp textbox" id="url" type="text" value={this.state.current.url} readOnly="readonly" onClick={this.copyURL}></input>
            <img id="check" src={check} width="24" className="absolute" alt="check"/>
            <button className="db ml3 flex items-center justify-center fw5 flex-shrink-0 black" id="save" onClick={this.saveImage}>下載圖片</button>
          </div>
          <ReactTooltip />
        </section>
        <section id="side" className="flex flex-column bg-dark-gray vh-100 z-1">
          <div className="center mv4">
            <img src={logo} width="166" alt="KKBOX"/>
          </div>
          <form action="javascript:void(0);" className="bb b--white-40">
            <div className="ph4 relative">
              <input id="input" className="db pa2 mb4 w-100 near-white" type="text" placeholder="輸入關鍵字搜尋" autoComplete="off" onChange={this.onInputChange}/>
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
  $('#mask').css({'background':'linear-gradient(15deg, '+data.darkVibrant+' 0%, '+data.darkVibrant+'00 75% 100%)'})
  return true;
}

function ChangeColor(props) {
  // eslint-disable-next-line  no-unused-vars 
  const { data, loading, error } = usePalette(props.url);
  $('main').css({'background-color': data.darkMuted});
  $('#card').css({'background-color': data.darkVibrant});
  $('#mask').css({'background':'linear-gradient(15deg, '+data.darkVibrant+' 0%, '+data.darkVibrant+'00 75% 100%)'})
  return true;
}
