/**
 * author: bngt bigdata rnd
 * 
 * date : 2022-06-16
 * 
 * this app for creamo wireless smart band
 * 
 */

import React from 'react';
import {
	View,
	Text,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/HomeScreen';
import BleScreen from './src/BleScreen';
import DeviceScreen from './src/DeviceScreen';
import ManageScreen from './src/ManageScreen';

const Stack = createNativeStackNavigator();

const App = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Wireless Band'}} />
				<Stack.Screen name="BleScreen" component={BleScreen} options={{ title: 'Bluetooth connect'}} />
				<Stack.Screen name='DeviceScreen' component={DeviceScreen} options={{ title: 'Show Devices detail'}} />
				<Stack.Screen name='ManageScreen' component={ManageScreen} options={{ title: 'Manage Devices'}} />
			</Stack.Navigator>
		</NavigationContainer>
	)
}

export default App;