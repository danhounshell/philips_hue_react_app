import React, { Component } from 'react';
import './App.css';
import GroupsView from './GroupsView';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">Home Lighting</h1>
          </header>
          <GroupsView />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
