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

const Stack = createNativeStackNavigator();

const App = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen name="HomeScreen" component={HomeScreen} />
				<Stack.Screen name="BleScreen" component={BleScreen} />
				<Stack.Screen name='DeviceScreen' component={DeviceScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	)
}

export default App;