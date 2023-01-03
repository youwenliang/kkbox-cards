import React, { Component } from 'react';
// eslint-disable-next-line  no-unused-vars 
import {Palette, usePalette} from 'react-palette';
import Tilty from 'react-tilty';
import './App.css';
import logo from './images/logo.png';
import mono from './images/listen.png';
import pattern1 from './images/pattern1.png';
import pattern2 from './images/pattern2.png';
import pattern3 from './images/pattern3.png';
import search from './images/ic_search_24.svg';
import check from './images/ic_check_24.png';
import $ from 'jquery';
import html2canvas from 'html2canvas';
import ReactTooltip from 'react-tooltip';
import searchStatus from './images/search.png';
import emptyStatus from './images/empty.png';
import slide1 from './images/Slide1.png';
import slide2 from './images/Slide2.png';
import slide3 from './images/Slide3.png';
import slide4 from './images/Slide4.png';
import slide5 from './images/Slide5.png';
import loading from './images/loading.gif';
import loadImage from 'image-promise';


var type = {
  'artist': '歌手',
  'track': '歌曲',
  'album': '專輯',
}

var colors = [];

let cardImage = (<img crossOrigin="anonymous" src="https://placehold.co/600" width="100%" className="mw-300" alt="cover"/>);

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
      text3: '',
      style: 'style0',
      first: true,
      easter: false
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

  componentDidMount() {
    const images = [logo, slide1, slide2, slide3, slide4, slide5];
     
    loadImage(images)
    .then(function (allImgs) {
        console.log(allImgs.length, 'images loaded!', allImgs);
        setTimeout(function(){
          $('.mask-black').addClass('o-0 pn');
        }, 1000);
    })
    .catch(function (err) {
        console.error('One or more images have failed to load :(');
        console.error(err.errored);
        console.info('But these loaded fine:');
        console.info(err.loaded);
    });
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
        if($(window).width() >= 400) win.document.write("<img width='100%' style='max-width:400px' crossOrigin='anonymous' src='" + canvas.toDataURL()+"'/>");
        else win.document.write("<img width='100%' crossOrigin='anonymous' src='" + canvas.toDataURL()+"'/>");
    });
  }

  selectCard(event, i) {
    this.setState({current: i, currentType: this.state.type, selected: true, first: true, text3: ''}, () => {
      this.updateCard();
      var key = event.target.querySelector('.primary').innerHTML;
      if(key.indexOf('最偉大的作品 (Greatest Works of Art)') > -1) {
        this.setState({easter: true});
      } else this.setState({easter: false});
    });
    $('.active').removeClass('active');
    event.target.classList.add('active');
    $('#canvas, #searchBtn').removeClass('hide');
    $('#side').addClass('hide');
    $('#input3').val('');
  }

  updateCard() {
    var url = (this.state.current.images === undefined) ? this.state.current.album.images[1].url : this.state.current.images[1].url;
    this.setState({url: url}, () => {
      this.onStyleChange();
    });
    cardImage = (<img crossOrigin="anonymous" src={url} width="100%" className={"mw-300 z-1 relative " + (this.state.type === "artist" ? "br-100":"")} alt="cover"/>);
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
    if(!event) {
      this.setState({
        style: "style0"
      });
      $('#card').css({'background-color': colors[2]});
      // $('#mask').css({'background':'linear-gradient(15deg, '+colors[0]+' 0%, '+colors[0]+'00 75% 100%)'});
    }
    else {
      this.setState({
        style: event.target.value,
        first: false
      }, () => {
        // console.log(this.state.style);
      });
      $('#card').css({'background-color': colors[2-parseInt(event.target.value.slice(-1))]});
      // $('#mask').css({'background':'linear-gradient(15deg, '+colors[parseInt(event.target.value.slice(-1))]+' 0%, '+colors[parseInt(event.target.value.slice(-1))]+'00 75% 100%)'})
    }
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
        text3: event.target.value
      }, () => {
          if(!this.state.text3) $('#text3').html('輸入文字訊息');
          else  $('#text3').html($t.state.text3);
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
        authorization: 'Bearer -Tz7kYZRsykmqxTCSIPMCg==',
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
              // console.log(result)
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
                <p className="primary ma0 pb1">{item.name}</p>
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

    var patternImg1 = {
      backgroundImage: 'url('+pattern1+')',
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
      // width: '100%',
      // height: '100%',
      // position: 'absolute',
      // top: 0,
      // left: 0
    }
    var patternImg2 = {
      backgroundImage: 'url('+pattern2+')',
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
      // width: '100%',
      // height: '100%',
      // position: 'absolute',
      // top: 0,
      // left: 0
    }
    var patternImg3 = {
      backgroundImage: 'url('+pattern3+')',
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
      // width: '100%',
      // height: '100%',
      // position: 'absolute',
      // top: 0,
      // left: 0
    }
    var patternImg4 = {
      backgroundImage: 'url(https://upload.wikimedia.org/wikipedia/commons/5/5c/Leonardo_da_Vinci%2C_Salvator_Mundi%2C_c.1500%2C_oil_on_walnut%2C_45.4_%C3%97_65.6_cm.jpg)',
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
      if(this.state.currentType === 'track') addName = (<p className="mv0 f7 o-90">{this.state.current.album.artist.name}</p>)
      else if(this.state.currentType === 'album') addName = (<p className="mv0 f7 o-90">{this.state.current.artist.name}</p>)
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
        <div id="card" className="cardp br3" data-tilt style={patternImg1}>
          <img id="mono" className="z-1" src={mono} width="120" alt="KKBOX" />
          <div id="mask" className="maskp near-white flex items-start flex-column justify-end">
            <p id="text2" className="mv0 f7 o-70">{type[this.state.currentType] ? type[this.state.currentType] : null}</p>
            <h1 id="text1" className="relative z-2 mv1 f2">{this.state.current.name ? this.state.current.name.split('(')[0] : null}</h1>
            {addName}
          </div>
          {cardImage}
          <div id="pattern" style={patternImg1}></div>
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
        <div id="card" className="cardp br3" data-tilt style={patternImg2}>
          <img id="mono" className="z-1" src={mono} width="120" alt="KKBOX" />
          <div id="mask" className="maskp near-white flex items-start flex-column justify-end">
            <p id="text2" className="mv0 f7 o-70">{type[this.state.currentType] ? type[this.state.currentType] : null}</p>
            <h1 id="text1" className="relative z-2 mv1 f2">{this.state.current.name ? this.state.current.name.split('(')[0] : null}</h1>
            {addName}
          </div>
          {cardImage}
          <div id="pattern" style={patternImg2}></div>
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
        <div id="card" className="cardp br3" data-tilt style={patternImg3}>
          <img id="mono" className="z-1" src={mono} width="120" alt="KKBOX" />
          <div id="mask" className="maskp near-white flex items-center flex-column justify-center">
            <div className="flex items-center flex-row justify-center">
              <div className="w-50 mr3">
                {cardImage}
              </div>
              <div>
                <p id="text2" className="mv0 f7 o-70">{type[this.state.currentType] ? type[this.state.currentType] : null}</p>
                <h1 id="text1" className="mv1 f3">{this.state.current.name ? this.state.current.name.split('(')[0] : null}</h1>
                {addName}
              </div>
            </div>
            <p id="text3" className={"mt4 f4 white tl w-100 lh-normal "+(this.state.text3 ? "fw6":"o-50")}>{this.state.text3 ? this.state.text3 : "輸入文字訊息"}</p>
          </div>
          <div className="o-0">
            {cardImage}
          </div>
          <div id="pattern" style={patternImg3}></div>
        </div>
      </Tilty>
      ),
      "style3" : (
      <Tilty 
        maxTilt={2}
        perspective={1400}
        easing="cubic-bezier(.03,.98,.52,.99)"
        speed={1200}
        scale={1.05}
        glare={true}
        maxGlare={1.8}
      >
        <div id="card" className="cardp br3" data-tilt style={patternImg4}>
          <div className="absolute w-100 top-0 left-0 o-20 h-100 rainbow"></div>
          <img id="mono" className="z-1" src={mono} width="120" alt="KKBOX" />
          <div id="mask" className="maskp near-white flex items-start flex-column justify-end">
            <p id="text2" className="mv0 f7 o-70">{type[this.state.currentType] ? type[this.state.currentType] : null}</p>
            <h1 id="text1" className="mv1 f2">{this.state.current.name ? this.state.current.name.split('(')[0] : null}</h1>
            {addName}
          </div>
          {cardImage}
          <div id="pattern" style={patternImg4}></div>
        </div>
      </Tilty>
      )
    }

    return (
      <main>
        <div id="home" className="absolute top0 left0 vh-100 w-100 flex bg-black flex-column justify-center items-center z-2">
          <div className="mask-black bg-black w-100 h-100 absolute top-0 left-0 z-2 flex justify-center items-center">
            <img src={loading} width="80" alt="loading"/>
          </div>
          <div id="looping" className="o-30">
            <img src={slide1} width="100%" alt="arts"/>
            <img src={slide2} width="100%" alt="arts"/>
            <img src={slide3} width="100%" alt="arts"/>
            <img src={slide4} width="100%" alt="arts"/>
            <img src={slide5} width="100%" alt="arts"/>
          </div>
          <div className="absolute flex justify-center flex-column items-center">
            <h1 className="near-white">
              <img src={logo} width="240" alt="KKCards"/>
            </h1>
            <p className="white ph5 lh-copy mw6">你不僅是音樂創作者，你同時還必須是行銷人員、創意總監、籌備人員，甚至是業餘的平面設計師。</p>
            <p className="white ph5 lh-copy mw6">我們希望讓你更輕鬆地建立可分享的吸睛社群媒體資產，讓你增加聽眾並慶祝成功。 </p>
            <button className="db mt3 flex items-center justify-center fw6 h40 flex-shrink-0 black primaryBtn" onClick={this.nextPage}>開始製作</button>
            <p className="near-white f6">Made by 最偉大的作品</p>
          </div>
        </div>
        <section id="canvas" className="flex justify-center items-center flex-column ph3 hide">
          <div id="maskBG" className="o-20 w-100 h-100 absolute"></div>
          <div className="w-100 mb4-l mb3 z-1">
            <form className="flex flex-row justify-center">
              <label className="labl">
                <input id="style0" aria-label="style0" type="radio" name="style" value="style0" onChange={this.onStyleChange} checked={this.state.style === "style0"}/>
                <div data-tip="風格一" htmlFor="style0" id="c1" className="cp circle br3 bg-near-white"></div>
              </label>
              <label className="labl">
                <input id="style1" aria-label="style1" type="radio" name="style" value="style1" onChange={this.onStyleChange} checked={this.state.style === "style1"}/>
                <div data-tip="風格二" htmlFor="style1" id="c2" className="cp circle br3 bg-near-white"></div>
              </label>
              <label className="labl">
                <input id="style2" aria-label="style2" type="radio" name="style" value="style2" onChange={this.onStyleChange} checked={this.state.style === "style2"}/>
                <div data-tip="風格三" htmlFor="style2" id="c3" className="cp circle br3 bg-near-white"></div>
              </label>
              <label className={"labl "+(this.state.easter ? "db" : "dn")}>
                <input id="style3" aria-label="style3" type="radio" name="style" value="style3" onChange={this.onStyleChange} checked={this.state.style === "style3"}/>
                <div data-tip="彩蛋風格" htmlFor="style3" id="c4" className="rainbow cp circle br3 bg-near-white flex justify-center items-center white"></div>
              </label>
            </form>
          </div>
          {card[this.state.style]}
          <FindColor url={this.state.url} first={this.state.first}/>
          <div className="controls mt4-l mt3 mw-400 z-1 f6">
            <form id="typing" className={this.state.style === "style2" ? "db":"dn"}>
              {/*<div className="mv3 flex items-center flex-row">
                <label className="near-white pr3">標題</label>
                <input aria-label="title" type="text" className="textbox flex-grow-1 h40 o-80" placeholder="輸入標題" onChange={(e) => this.onTyping(0, e)}/>
              </div>*/}
              <div className="mb3 flex items-center flex-row">
                <label className="near-white pr3 mv2">內文</label>
                <input aria-label="content" maxLength="60" type="text" id="input3" className="textbox flex-grow-1 h40 o-80" placeholder="輸入文字訊息" onChange={(e) => this.onTyping(1, e)}/>
              </div>
            </form>
          </div>
          <div className="controls w-100 mw-400 flex flex-row items-center relative z-1 f6 ">
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
          <form action="javascript:void(0);" className="bb b--white-40">
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

  colors = [data.darkVibrant, data.muted, data.darkMuted, data.lightVibrant, data.Vibrant, data.lightMuted];

  $('#c1').css({'background-color': colors[2]});
  $('#c2').css({'background-color': colors[1]});
  $('#c3').css({'background-color': colors[0]});

  if(props.first) {
    $('#card').css({'background-color': colors[2]});
    // $('#mask').css({'background':'linear-gradient(15deg, '+colors[0]+' 0%, '+colors[0]+'00 75% 100%)'});
  }

  return true;
}
