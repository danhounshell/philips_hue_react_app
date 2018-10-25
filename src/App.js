import React, { Component } from 'react';
import './App.css';
import GroupsView from './GroupsView';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">Home Automation</h1>
          </header>
          <Tabs defaultIndex={0}>
            <TabList>
              <Tab>Lighting</Tab>
              <Tab>Switches</Tab>
              <Tab>Security</Tab>
              <Tab disabled>Other</Tab>
            </TabList>
            <TabPanel>
              <GroupsView />
            </TabPanel>
            <TabPanel>
              <h2>Coming Soon</h2>
            </TabPanel>
            <TabPanel>
              <h2>Coming Soon</h2>
            </TabPanel>
            <TabPanel>
              <h2>Coming Soon</h2>
            </TabPanel>
          </Tabs>          
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
