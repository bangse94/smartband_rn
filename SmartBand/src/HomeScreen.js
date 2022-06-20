import React from "react";
import {
	SafeAreaView,
	Text,
	View,
	TouchableOpacity,
} from 'react-native';

export default function HomeScreen({ navigation }) {
	return (
    <SafeAreaView
      style={{flex: 1, alignItems: 'center', justifyContent: 'flex-start'}}
      flexDirection="column">
      <SafeAreaView
        style={{
          width: '100%',
          height: '100%',
          justifyContent: 'space-evenly',
          alignContent: 'center',
          alignItems: 'center',
        }}
        flexDirection="column">
        <TouchableOpacity
          style={{
            width: '70%',
            height: '20%',
            backgroundColor: '#8f8fff',
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            borderRadius: 20,
            borderWidth: 1,
          }}
          onPress={() => navigation.navigate('BleScreen')}>
          <Text style={{fontSize: 30, fontWeight: 'bold', color: 'white'}}>
            Bluetooth connect
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: '70%',
            height: '20%',
            backgroundColor: '#8f8fff',
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            borderRadius: 20,
            borderWidth: 1,
          }}
          onPress={() => navigation.navigate('DeviceScreen')}>
          <Text style={{fontSize: 30, fontWeight: 'bold', color: 'white'}}>
            Show devices
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: '70%',
            height: '20%',
            backgroundColor: '#8f8fff',
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            borderRadius: 20,
            borderWidth: 1,
          }}
          onPress={() => navigation.navigate('ManageScreen')}>
          <Text style={{fontSize: 30, fontWeight: 'bold', color: 'white'}}>
            Manage Device
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
      {/* Button layout */}
      <View></View>
      {/* Body */}
    </SafeAreaView>
  );
}