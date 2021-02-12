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
    device: "",
    rssi : 0,
    count : 0, 
    blestate : ""
  }

  const subscription = this.manager.onStateChange((state) => {
    if (state === 'PoweredOn') {
        this.scanAndConnect();
        subscription.remove();
    }
}, true);
}

pressButton () {
  this.setState({count: this.state.count + 1})
  this.scanAndConnect()
}
scanAndConnect() {
  this.manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
          // Handle error (scanning will be stopped automatically)
          this.setState({device: error.message})
          this.manager.stopDeviceScan();
          return
      }

      // Check if it is a device you are looking for based on advertisement data
      // or other criteria.
      if (device.id === "DC:A6:32:CD:4C:3F"){
        this.setState({rssi: device.rssi})
        this.setState({device: device.id})     
          // Stop scanning as it's not necessary if you are scanning for one device.
          this.manager.stopDeviceScan();
      }

          
          // Proceed with connection.
      
  });
}

 render() {
    return (
      <View>
          <Text>
            You scanned { this.state.device } 
            </Text>
          <Text>
          Distance {this.state.rssi}
          </Text>
          <Text>
          State {this.state.blestate}
          </Text>
          <Button
        title="Scan"
        onPress={() => this.pressButton()}
      />
      <Text>
          Button Count {this.state.count}
          </Text>
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