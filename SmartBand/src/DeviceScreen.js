import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  NativeModules,
  NativeEventEmitter,
  Button,
  Platform,
  PermissionsAndroid,
  FlatList,
  TouchableHighlight,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import BleManager from 'react-native-ble-manager';
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const App = ({navigation}) => {
  const [isScanning, setIsScanning] = useState(false);
  const peripherals = new Map();
  const [list, setList] = useState([]);
  var dataCnt = 0;
  var sumData = [0,0,0,0,0,0];
  var averageData = [0,0,0,0,0,0];
  var locPermission = false;
  var scanPermission = false;
  var connectPermission = false;


  // for calculate METs
  var ax = 0;
  var ay = 0;
  var az = 0;
  var energy = 0;
  var energySum = 0;
  var kcal = 0;
  var childWeight = 20;
  var MET = 0;

  const startScan = () => {
    if (!isScanning) {
      BleManager.scan([], 3, true)
        .then(results => {
          console.log('Scanning...');
          setIsScanning(true);
        })
        .catch(err => {
          console.error(err);
        });
    }
  };

  const handleStopScan = () => {
    console.log('Scan is stopped');
    setIsScanning(false);
  };

  const handleDisconnectedPeripheral = data => {
    let peripheral = peripherals.get(data.peripheral);
    if (peripheral) {
      peripheral.connected = false;
      peripherals.set(peripheral.id, peripheral);
      setList(Array.from(peripherals.values()));
    }
    console.log('Disconnected from ' + data.peripheral);
  };

  const handleUpdateValueForCharacteristic = data => {
	// setInterval(() => {
	// 	console.log('data update --');
	// 	console.log(
	// 	  'Received data from ' +
	// 		data.peripheral +
	// 		' characteristic ' +
	// 		data.characteristic +
	// 		String.fromCharCode.apply(null, data.value),
	// 	);
	// }, 5000);
	dataCnt += 1;
	var inputDataString = String.fromCharCode.apply(null, data.value);
	inputDataString = inputDataString.slice(1, -4);
	var inputDataArray = inputDataString.split(",");
	// for (var i = 0 ; i < inputDataArray.length ; i++){
	// 	sumData[i] = sumData[i] + Number(inputDataArray[i]);
	// }
	ax = Number(inputDataArray[-3]);
	ay = Number(inputDataArray[-2]);
	az = Number(inputDataArray[-1]);
	energy = Math.sqrt(Math.pow(ax,2) + Math.pow(ay, 2) + Math.pow(az, 2));
	energySum = energySum + energy;
  };

  const retrieveConnected = () => {
    BleManager.getConnectedPeripherals([]).then(results => {
      if (results.length == 0) {
        console.log('No connected peripherals');
      }
      console.log(results);
      for (var i = 0; i < results.length; i++) {
        var peripheral = results[i];
        peripheral.connected = true;
        peripherals.set(peripheral.id, peripheral);
        setList(Array.from(peripherals.values()));
      }
    });
  };

  const handleDiscoverPeripheral = peripheral => {
    console.log('Got ble peripheral', peripheral);
    if (!peripheral.name) {
      peripheral.name = 'NO NAME';
    }
    peripherals.set(peripheral.id, peripheral);
    setList(Array.from(peripherals.values()));
  };

  const testPeripheral = peripheral => {
    if (peripheral) {
      if (peripheral.connected) {
        BleManager.disconnect(peripheral.id);
      } else {
        BleManager.connect(peripheral.id)
          .then(() => {
            let p = peripherals.get(peripheral.id);
            if (p) {
              p.connected = true;
              peripherals.set(peripheral.id, p);
              setList(Array.from(peripherals.values()));
            }
            console.log('Connected to ' + peripheral.id);

            setTimeout(() => {
              /* Test read current RSSI value */
              BleManager.retrieveServices(peripheral.id).then(
                peripheralData => {
                  console.log('Retrieved peripheral services', peripheralData);

                  BleManager.readRSSI(peripheral.id).then(rssi => {
                    console.log('Retrieved actual RSSI value', rssi);
                    let p = peripherals.get(peripheral.id);
                    ``;
                    if (p) {
                      p.rssi = rssi;
                      peripherals.set(peripheral.id, p);
                      setList(Array.from(peripherals.values()));
                    }
                  });
                },
              );
            }, 900);
          })
          .catch(error => {
            console.log('Connection error', error);
          });
      }
    }
  };

  useEffect(() => {
    BleManager.start({showAlert: false});

    bleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      handleDiscoverPeripheral,
    );
    bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan);
    bleManagerEmitter.addListener(
      'BleManagerDisconnectPeripheral',
      handleDisconnectedPeripheral,
    );
    bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic);

    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ).then(result => {
        if (result) {
          console.log('Bluetooth Permission is OK');
          locPermission = true;
        } else {
          console.log('Bluetooth Permission has denied');
          locPermission = false;
        }
      });
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      ).then(result => {
        if (result) {
          console.log('Scan Permission is OK');
          scanPermission = true;
        } else {
          console.log('Scan Permission has denied');
          scanPermission = false;
        }
      });
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ).then(result => {
        if (result) {
          console.log('Connect Permission is OK');
          connectPermission = true;
        } else {
          console.log('Connect Permission has denied');
          connectPermission = false;
        }
      });

      if (locPermission && scanPermission && connectPermission) {
        console.log('All Permission is OK');
      } else {
        PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        ]).then(result => {
          if (
            result['android.permission.ACCESS_COARSE_LOCATION'] &&
            result['android.permission.BLUETOOTH_SCAN'] &&
            result['android.permission.BLUETOOTH_CONNECT'] === 'granted'
          ) {
            locPermission = true;
            scanPermission = true;
            connectPermission = true;
            console.log('All Permission granted');
          } else {
            console.log('some Permission has denied');
          }
        });
      }
    }

    setTimeout(() => {
      BleManager.getConnectedPeripherals([]).then(devices => {
        for (var i = 0; i < devices.length; i++) {
          BleManager.retrieveServices(devices[i].id).then(data => {
            console.log('data --');
            console.log(data.advertising.serviceUUIDs[0]);
            console.log(data.characteristics[4].characteristic);
            BleManager.startNotification(
              data.id,
              data.advertising.serviceUUIDs[0],
              data.characteristics[4].characteristic,
            )
              .then(() => {
                console.log(data.id);
                console.log('Notification started ', [i]);
              })
              .catch(error => {
                console.log(error);
              });
          });
        }
      });
      retrieveConnected();
    }, 500);

	setInterval(() => {
	//   console.log("sum data : " , sumData);
	//   for(var i = 0 ; i < sumData.length ; i++) {
	// 	  averageData[i] = sumData[i] / dataCnt;
	//   }
	//   console.log("average data : " ,averageData);
	//   dataCnt = 0;
	//   averageData = [0,0,0,0,0,0];
	//   sumData = [0,0,0,0,0,0];
	//   MET = 1.8290 + (1.0176*0.0001*energySum);
      kcal = (3.692*Math.pow(10, -5))*energySum+1.728;
	  METs = (7*kcal)/(400*childWeight);
	  console.log(kcal);
	  console.log("METs-min : " +METs);
	}, 60000);
    return () => {};
  }, []);

  const renderItem = item => {
    const color = item.connected ? 'green' : '#fff';
    return (
      <View>
        <View style={[styles.row, {backgroundColor: color}]}>
          <Text
            style={{
              fontSize: 12,
              textAlign: 'center',
              color: '#333333',
              padding: 10,
            }}>
            {item.name}
          </Text>
          <Text
            style={{
              fontSize: 10,
              textAlign: 'center',
              color: '#333333',
              padding: 2,
            }}>
            RSSI: {averageData}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          <View style={styles.body}>
            <View style={{margin: 10}}>
              <Button title="Reload" onPress={() => {}} />
            </View>

            {list.length == 0 && (
              <View style={{flex: 1, margin: 20}}>
                <Text style={{textAlign: 'center'}}>No peripherals</Text>
              </View>
            )}
          </View>
        </ScrollView>
        <FlatList
          data={list}
          renderItem={({item}) => renderItem(item)}
          keyExtractor={item => item.id}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
