import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  Pressable,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { Link } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCard } from 'context/CardContext';
import { Card } from 'components/Card';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

export default function CollectionScreen() {
  // Ya no necesitas useAuth ni supabase aquí, solo las cartas
  const { cards, loading } = useCard();

  // Lógica visual (colores, stats) se queda aquí porque es de presentación
  const getRarityColor = (rarity) => {
    const rarityColors = {
      Common: '#9CA3AF',
      Uncommon: '#10B981',
      Rare: '#3B82F6',
      'Rare Holo': '#8B5CF6',
      'Double rare': '#C026D3',
      'Ultra Rare': '#F59E0B',
      'Secret Rare': '#EF4444',
      'Illustration Rare': '#F472B6',
      'Hyper Rare': '#EAB308',
    };
    return rarityColors[rarity] || '#6B7280';
  };

  // Calcular estadísticas usando los datos del contexto
  const totalCards = cards.length;
  // Usamos 'cards' en lugar de 'misCartas'
  const uniqueSets = new Set(cards.map((card) => card.set)).size;
  const totalPrice = cards.reduce((sum, card) => {
    const price = parseFloat(card.price);
    return sum + (isNaN(price) ? 0 : price);
  }, 0);

  if (loading && cards.length === 0) {
    // Solo mostramos loading si no tenemos cartas previas cargadas
    return (
      <View className="flex-1 items-center justify-center bg-[#18122B]">
        <ActivityIndicator size="large" color="#8B2DF0" />
        <Text className="mt-4 font-bold text-white">Actualizando colección...</Text>
      </View>
    );
  }

  if (cards.length === 0 && !loading) {
    return (
      <Screen>
        <StatusBar style="light" />
        <View className="flex-1 items-center justify-center p-6">
          <MaterialCommunityIcons name="cards-outline" size={100} color="#8B2DF0" />
          <Text className="mt-6 text-center text-2xl font-bold text-white">
            Tu colección está vacía
          </Text>
          {/* ... resto del código de estado vacío ... */}
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <StatusBar style="light" />
	  <View className="absolute top-0 left-0 right-0 h-96">
		<LinearGradient
		  colors={['rgba(139, 45, 240, 0.15)', 'transparent']}
		  style={{ flex: 1 }}
		/>
	  </View>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="pb-6">
          <View className="px-6 pt-6">
            <Text className="mb-2 text-center text-4xl font-bold text-white">Mi Colección</Text>
            <Text className="mb-6 text-center text-base text-purple-200">Tus cartas Pokémon</Text>

            {/* Estadísticas */}
            <View className="flex-row gap-3">
              <View className="flex-1 rounded-2xl bg-white/10 p-4">
                <View className="mb-2 flex-row items-center justify-center">
                  <MaterialCommunityIcons name="cards" size={24} color="#8B2DF0" />
                </View>
                <Text className="text-center text-2xl font-bold text-white">{totalCards}</Text>
                <Text className="text-center text-xs text-gray-300">Cartas</Text>
              </View>

              <View className="flex-1 rounded-2xl bg-white/10 p-4">
                <View className="mb-2 flex-row items-center justify-center">
                  <MaterialCommunityIcons name="pokeball" size={24} color="#F8D030" />
                </View>
                <Text className="text-center text-2xl font-bold text-white">{uniqueSets}</Text>
                <Text className="text-center text-xs text-gray-300">Sets</Text>
              </View>

              <View className="flex-1 rounded-2xl bg-white/10 p-4">
                <View className="mb-2 flex-row items-center justify-center">
                  <MaterialCommunityIcons name="currency-usd" size={24} color="#10B981" />
                </View>
                <Text className="text-center text-2xl font-bold text-white">
                  {totalPrice.toFixed(2)}
                </Text>
                <Text className="text-center text-xs text-gray-300">Precio total</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Grid de cartas */}
        <View className="px-4 pb-6">
          <View className="flex-row flex-wrap justify-between">
            {cards.map((item: any, index: number) => (
              <Link
                key={item.id}
                href={{
                  pathname: '/card/[id]',
                  params: {
                    id: item.id,
                    cardData: JSON.stringify(item),
                  },
                }}
                asChild>
                <Card 
                    item={item} 
                    width={cardWidth} 
                />
              </Link>
            ))}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
