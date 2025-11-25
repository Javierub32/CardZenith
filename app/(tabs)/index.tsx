import { View, Text, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';


export default function HomeScreen() {
  return (
	<Screen>
		<ScrollView className="flex-1 ">
		<StatusBar style="light" />
		<View className="flex-1 items-center justify-center p-6">
			<Text className="text-4xl font-bold text-blue-500 mb-4">
			Bienvenido
			</Text>
			<Text className="text-lg text-gray-700 text-center mb-6">
			Esta es la pantalla de inicio de tu aplicación con Expo Router
			</Text>
			<View className="bg-blue-50 p-6 rounded-lg w-full">
			<Text className="text-base text-gray-800 mb-2">
				✨ Navegación configurada con tabs
			</Text>
			<Text className="text-base text-gray-800 mb-2">
				🎨 Estilizado con NativeWind (Tailwind CSS)
			</Text>
			<Text className="text-base text-gray-800">
				📱 5 pantallas listas para usar
			</Text>
			</View>
		</View>
		</ScrollView>
	</Screen>
  );
}
