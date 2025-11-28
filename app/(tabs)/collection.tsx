import { View, Text, ScrollView, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';

// Importar las imágenes estáticamente
const celebiImg = require('../../assets/celebi1.jpg');
const pikachuImg = require('../../assets/pikachu.jpg');
const snivyImg = require('../../assets/snivy.jpg');

export default function FavoritesScreen() {
  const pokemons = [
    { id: 1, title: 'Celebi ex', collec: 'Sword and Shield', num: '001/135', img: celebiImg },
    { id: 2, title: 'Pikachu ex', collec: 'Vivid voltage', num: '023/185', img: pikachuImg },
    { id: 3, title: 'Snivy', collec: 'Black Bolt', num: '045/102', img: snivyImg },
  ];

  return (
    <Screen>
      <ScrollView className="flex-1">
        <View className="flex-1 p-6">
          <Text className="mb-4 text-center text-4xl font-bold text-white">Cartas</Text>
          <Text className="mb-6 text-center text-lg text-gray-100">Tus cartas guardadas</Text>

          <View className="space-y-4">
            {pokemons.map((item) => (
              <View
                key={item.id}
                className="mb-4 flex-row overflow-hidden rounded-xl border-2 bg-slate-700 shadow-lg">
                {/* Imagen de la carta */}
                <View className="flex-1">
                  <Image source={item.img} className="h-64 w-full" resizeMode="contain" />
                </View>

                {/* Encabezado de la tarjeta */}
                <View className="flex-1 p-3">
                  <Text className="mb-1 text-2xl font-bold text-white">{item.title}</Text>
                  <View className="flex-row items-center">
                    <Text className="text-sm text-red-100">
                      <Text>#{item.num}</Text>
                    </Text>
                  </View>
                  {/* Colección */}
                  <View className="mb-3 rounded-lg bg-gray-50 p-3">
                    <Text className="mb-1 text-xs uppercase tracking-wide text-gray-500">
                      <Text>Colección</Text>
                    </Text>
                    <Text className="text-base font-semibold text-gray-800">{item.collec}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
          {pokemons.length === 0 && (
            <View className="items-center justify-center py-12">
              <Text className="text-center text-lg text-gray-400">
                No tienes cartas todavía. ¡Agrega alguna a tu colección!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}
