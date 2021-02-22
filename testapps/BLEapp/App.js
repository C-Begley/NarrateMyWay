import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Button
} from 'react-native'

import { BleManager } from 'react-native-ble-plx';


class App extends Component {
  constructor() {
    super();
    this.manager = new BleManager();
    this.state = {
    count : 0, 
    name_list : [],
    addr_list : [],
    local_list : [],
    rssi_dict : {},
    error : "No Error"
  }

  const subscription = this.manager.onStateChange((state) => {
    if (state === 'PoweredOn') {
        subscription.remove();
    }
}, true);
}
pressButton () {
  this.setState({name_list : []});
  this.setState({addr_list : []});
  this.setState({local_list : []});
  this.setState({rssi_dict : {}});
  this.setState({error : "No Error"});
  this.scanAndConnect()
  this.setState({count: this.state.count + 1})
}
scanAndConnect() {
  this.manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
          // Handle error (scanning will be stopped automatically)
          this.setState({error: error.message})
          this.manager.stopDeviceScan();
          return
      }
        //if (device.name.startsWith("nwm:")){
          this.addNWMDevice(device);
        //}
        this.addBLEDevice(device);     
  });
}

addNWMDevice(device) {
  d = this.state.rssi_dict
  d[device.id] = device.rssi;
  this.setState({rssi_dict: d});
}
 
helperList(l,property){
  if (! l.includes(property)) {
    l.push(property);
    return l;
 }
 return null;
}
 addBLEDevice(device){
   li = this.helperList(this.state.addr_list, device.id);
   if (li != null){
     this.setState({addr_list : li});
   }
   li = this.helperList(this.state.name_list, device.name);
   if (li != null){
     this.setState({name_list : li});
   }
   li = this.helperList(this.state.name_list, device.localname);
   if (li != null){
     this.setState({local_list : li});
   }
}
 render() {
    return (
      <View>
          <Button title="Scan"onPress={() => this.pressButton()}/>
          <Text>Scan Count {this.state.count}</Text>
          <Text>----- </Text>
          <Text>Names</Text>
          {this.state.name_list.map((device,index) => (<Text key={index}>{device}</Text>))}
          <Text>----- </Text>
          <Text/>
          <Text>----- </Text>
          <Text>IDs</Text>
          {this.state.addr_list.map((device,index) => (<Text key={index}>{device}</Text>))}
          <Text>-----</Text>
          <Text/>
          <Text>----- </Text>
          <Text>Local Names</Text>
          {this.state.local_list.map((device,index) => (<Text key={index}>{device}</Text>))}
          <Text>-----</Text>
          <Text>----- </Text>
          <Text>RSSI</Text>
          {Object.entries(this.state.rssi_dict).map(([keyName, keyValue]) => (<Text key={keyName}>{keyName} : {keyValue} </Text>))}
          <Text>-----</Text>
          <Text>Error : {this.state.error}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    marginBottom: 10
  }
})

export default App;