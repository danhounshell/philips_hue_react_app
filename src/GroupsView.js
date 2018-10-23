import React, { Component } from 'react';
import GroupItem from './GroupItem';
import hueApi from './api/phillipsHue';

class GroupsView extends Component {
  constructor(props) {
    super(props);
    this.requestFailed = false;
    this.groupData = null;

    this.fetchData = this.fetchData.bind(this);
    this.onToggleGroup = this.onToggleGroup.bind(this);
    setInterval(this.fetchData,30000);
  }

  componentWillMount() {
    this.fetchData();
  }

  getGroupsUrl() {
    return hueApi.groupsUrl();
  } 

  fetchData() {
    hueApi.fetchGroups()
      .then( d => {
        this.groupData = d.groupData;
        this.requestFailed = d.requestFailed;
        this.setState({newData:new Date()});
      });
  }

  onToggleGroup(id, isOn) {
    hueApi.toggleGroup(id, isOn)
      .then(d => {
        this.requestFailed = d.requestFailed;
        this.fetchData();
      }, () => {
        this.requestFailed = true;
      })
  }

  render() {
    if (this.requestFailed) {
      let url = this.getGroupsUrlWithUsername();
      return <p className='warning'>Could not fetch from {url}</p>
    }

    if (!this.groupData) {
      return <p>Loading...</p>;
    }

    if (this.groupData[0] !== undefined) {
      return <p className='warning'>{this.groupData[0].error.description}</p>;
    }

    let groupData = this.groupData;
    let groupItems = [];
    let groupToggleHandler = this.onToggleGroup;
    let onStateChangedHandler = this.fetchData;
    if ( groupData ) {
        Object.keys(groupData).forEach(function(id) {
            let item = groupData[id];
            let group = <GroupItem key={id} id={id} name={groupData[id].name} 
                        isOn={item.state.any_on} bri={item.action.bri} 
                        allOn={item.state.all_on}
                        anyOn={item.state.any_on}
                        onStateChanged={onStateChangedHandler}
                        onToggleGroup={groupToggleHandler}
                        includesLights={item.lights}/>
            groupItems.push(group);      
        });
    }

    return (
      <div className="groups" align='center' style={{maxWidth:950,margin: '20px auto 0'}}>
          {groupItems}
      </div>
    );
  }
}

export default GroupsView;
