import React from 'react';

import { BleManager, Device } from 'react-native-ble-plx';

type BLEState = {
  beaconFound: Boolean;
  error: any;
};

class BLE extends React.Component<{}, BLEState> {
  beaconDevice: any;
  threshold: any;
  manager!: BleManager;

  constructor(threshold = 0) {
    super({});
    this.state = { beaconFound: false, error: null };
    (this.beaconDevice = null),
      (this.manager = new BleManager()),
      (this.threshold = threshold);
  }

  _updateBeacon(device: Device | null) {
    this.beaconDevice = device;
  }

  _resetBeacon() {
    this._updateBeacon(null);
    this.setState({ beaconFound: false });
  }

  _newBeacon(device: Device) {
    this._updateBeacon(device);
    this.setState({ beaconFound: true });
  }

  _addNMWDevice(device: Device) {
    if (device.rssi == null) {
      if (device.id == this.beaconDevice.id) {
        this._resetBeacon();
      }
    } else {
      if (this.state.beaconFound && this.beaconDevice.id == device.id) {
        if (device.rssi < this.threshold) {
          this._resetBeacon();
        } else {
          this._updateBeacon(device);
        }
      } else if (
        device.rssi > this.beaconDevice.rssi &&
        device.rssi > this.threshold
      ) {
        this._newBeacon(device);
      }
    }
  }

  _checkBeacons() {
    this.manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        this.setState({ error: error.message });
        this.manager.stopDeviceScan();
        return;
      }
      if (device != null) {
        if (device.name != null) {
          if (device.name.startsWith('nmw:')) {
            this._addNMWDevice(device);
          }
        }
      }
    });
  }

  scan() {
    this._resetBeacon();
    this._checkBeacons();
  }
}
export default BLE;
