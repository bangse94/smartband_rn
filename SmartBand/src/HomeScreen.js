import React from "react";
import {
	Text,
	View,
	TouchableOpacity,
} from 'react-native';

export default function HomeScreen({ navigation }) {
	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start'}} flexDirection='column'>
			<View style={{width: '100%', height: '10%', justifyContent: 'space-around', alignContent: 'center', alignItems: 'center', padding: 10}} flexDirection='row'>
				<TouchableOpacity
					style={{width: '30%', height: '100%', backgroundColor: '#8f8fff', justifyContent: 'center', alignContent: 'center', alignItems: 'center',
							borderRadius: 20, borderWidth: 1}}
					onPress={() => navigation.navigate("BleScreen")}
				>
					<Text>Bluetooth connect</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={{width: '30%', height: '100%', backgroundColor: '#8f8fff', justifyContent: 'center', alignContent: 'center', alignItems: 'center',
							borderRadius: 20, borderWidth: 1}}
					onPress={() => navigation.navigate("DeviceScreen")}
				>
					<Text>Show devices</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={{width: '30%', height: '100%', backgroundColor: '#8f8fff', justifyContent: 'center', alignContent: 'center', alignItems: 'center',
							borderRadius: 20, borderWidth: 1}}
					onPress={() => navigation.navigate("BleScreen")}
				>
					<Text>Manage Device</Text>
				</TouchableOpacity>
			</View>{/* Button layout */}
			<View>

			</View>{/* Body */}
		</View>
	);
}