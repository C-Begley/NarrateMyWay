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

        this.addBLEDevice(device);

          
          // Proceed with connection.
      
  });
}

 addBLEDevice(device){
   if (! this.state.addr_list.includes(device.id)) {
      l = this.state.addr_list;
      l.push(device.id);
      this.setState({addr_list : l});
   }
   if (! this.state.name_list.includes(device.name)) {
      l = this.state.name_list;
      l.push(device.name);
      this.setState({name_list : l});
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