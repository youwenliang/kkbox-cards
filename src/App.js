import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      keyword: '',
      type: 'artist'
    };
    this.onValueChange = this.onValueChange.bind(this);
    this.getInputValue = this.getInputValue.bind(this);
    this.getInfo = this.getInfo.bind(this);
  }

  componentDidMount() {
    
  }

  onValueChange(event) {
    this.setState({
      type: event.target.value
    });
  }

  getInputValue(event) {
    event.preventDefault();
    var keyword = document.getElementById("input").value;
    var type = document.querySelector('input[name="type"]:checked').value;
    this.setState({keyword: keyword, type: type});
    this.getInfo(keyword, type);
  }

  getInfo(keyword, type) {
    fetch('https://api.kkbox.com/v1.1/search?q='+keyword+'&type='+type+'&territory=TW&offset=0&limit=10', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        //authorization: 'Bearer F5MKSIpHAt9ukR7tWo9vdg==!',
      },
    })
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result[type+'s'].data
          });
          console.log(result)
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
      result = (<div>Loading...</div>);
    } else {
      result = (
        <ul>
          {items.map(item => (
            <li key={item.id}>
              <span>{item.name} {item.url}</span>
              <img src={(item.images === undefined) ? item.album.images[0].url : item.images[0].url} width="100" />
            </li>
          ))}
        </ul>
      )
    }
    return (
      <main>
        <form action="javascript:void(0);">
          <input id="input" type="text" placeholder="輸入歌手名稱"/>
            <input type="radio" id="artist" name="type" value="artist" onChange={this.onValueChange} checked={this.state.type === "artist"}/>
            <label>歌手</label>
            <input type="radio" id="album" name="type" value="album" onChange={this.onValueChange} checked={this.state.type === "album"}/>
            <label>專輯</label>
            <input type="radio" id="track" name="type" value="track" onChange={this.onValueChange} checked={this.state.type === "track"}/>
            <label className="mr2">歌曲</label>
          <input type="submit" value="搜尋" onClick={this.getInputValue}/>
        </form>
        {result}
      </main>
    )
  }
}
export default App;
