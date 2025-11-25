import { View, Text, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';


export default function FavoritesScreen() {
  const favorites = [
    { id: 1, title: 'Favorito 1', description: 'Este es tu primer favorito' },
    { id: 2, title: 'Favorito 2', description: 'Un elemento guardado' },
    { id: 3, title: 'Favorito 3', description: 'Otro item que te gusta' },
  ];

  return (
	<Screen>
		<ScrollView className="flex-1">
		<View className="flex-1 p-6">
			<Text className="text-4xl font-bold text-red-500 mb-4 text-center">
			Favoritos
			</Text>
			<Text className="text-lg text-gray-700 text-center mb-6">
			Tus elementos guardados
			</Text>
			
			<View className="space-y-4">
			{favorites.map((item) => (
				<View
				key={item.id}
				className="bg-red-50 p-4 rounded-lg border border-red-200"
				>
				<Text className="text-xl font-semibold text-red-800 mb-2">
					❤️ {item.title}
				</Text>
				<Text className="text-gray-600">{item.description}</Text>
				</View>
			))}
			</View>

			{favorites.length === 0 && (
			<View className="items-center justify-center py-12">
				<Text className="text-gray-400 text-center text-lg">
				No tienes favoritos todavía
				</Text>
			</View>
			)}
		</View>
		</ScrollView>
	</Screen>
  );
}
