import { View, Text, ScrollView, Dimensions, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useCard } from 'context/CardContext';
import { Card } from 'components/Card';
import { Link } from 'expo-router';

const { width } = Dimensions.get('window');
// Hacemos las cartas del carrusel un pelín más grandes que las del grid para que destaquen
const CAROUSEL_CARD_WIDTH = width * 0.45; 
const SPACING = 16;

export default function HomeScreen() {
  const { cards, loading } = useCard();

  // Lógica de ordenación (segura contra valores nulos)
  const mostExpensiveCards = [...cards]
    .filter(c => c.price && !isNaN(parseFloat(c.price)))
    .sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
    .slice(0, 5); // Mostramos top 5

  const newestCards = [...cards]
    .sort((a, b) => new Date(b.obtained_at).getTime() - new Date(a.obtained_at).getTime())
    .slice(0, 5);

  // Componente para cuando no hay cartas
  const EmptySection = () => (
    <View className="h-40 items-center justify-center rounded-2xl bg-white/5 border border-white/10 mx-6 border-dashed">
      <MaterialCommunityIcons name="cards-outline" size={32} color="#6B7280" />
      <Text className="text-gray-500 mt-2 text-sm">Sin cartas destacadas</Text>
    </View>
  );

  return (
    <Screen>
      <StatusBar style="light" />
      
      {/* Fondo con degradado sutil en la parte superior */}
      <View className="absolute top-0 left-0 right-0 h-96">
        <LinearGradient
          colors={['rgba(139, 45, 240, 0.15)', 'transparent']}
          style={{ flex: 1 }}
        />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="pb-12 pt-6">
          
          {/* Header Principal */}
          <View className="px-6 mb-8">
            <Text className="text-purple-300 font-semibold tracking-widest text-xs uppercase mb-1">
              Dashboard
            </Text>
            <Text className="text-4xl font-extrabold text-white">
              Resumen
            </Text>
            <Text className="text-gray-400 text-base">
              Estadísticas de tu colección
            </Text>
          </View>
          {/* SECCIÓN: Recién llegadas */}
          <View className="mb-6">
			<View className='flex-row justify-between px-6 mb-4'>
            <View className="flex-row items-center gap-2">
              <View className="bg-blue-500/20 p-2 rounded-full items-start">
                <MaterialCommunityIcons name="clock-time-four" size={20} color="#60A5FA" />
              </View>
              <Text className="text-xl font-bold text-white">Recientes</Text>

            </View>
						                <Link href="/collection" asChild>
                 <Text className="text-purple-400 text-sm font-semibold">Ver todas</Text>
              </Link>
			</View>

            {newestCards.length > 0 ? (
              <FlatList
                data={newestCards}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => `new-${item.id}`}
                contentContainerStyle={{ paddingHorizontal: 8, paddingRight: 8 }}
                snapToInterval={CAROUSEL_CARD_WIDTH + SPACING}
                decelerationRate="fast"
                renderItem={({ item }) => (
                  <Link
                    href={{
                      pathname: '/card/[id]',
                      params: { id: item.id, cardData: JSON.stringify(item) },
                    }}
                    asChild>
                    <View style={{ width: CAROUSEL_CARD_WIDTH, marginRight: SPACING }}>
                       {/* Badge de 'Nueva' */}
                       <View className="absolute top-2 left-2 z-10 bg-blue-600 px-2 py-0.5 rounded shadow-sm">
                         <Text className="text-white text-[10px] font-bold uppercase">New</Text>
                      </View>
                      <Card item={item} width={CAROUSEL_CARD_WIDTH} />
                    </View>
                  </Link>
                )}
              />
            ) : <EmptySection />}
          </View>

          {/* SECCIÓN: Joyas de la corona (Más caras) */}
          <View className="mb-8">
            <View className="flex-row items-center justify-between px-6 mb-4">
              <View className="flex-row items-center gap-2">
                <View className="bg-yellow-500/20 p-2 rounded-full">
                  <MaterialCommunityIcons name="trophy" size={20} color="#FBBF24" />
                </View>
                <Text className="text-xl font-bold text-white">Top Valor</Text>
              </View>
              {/* Opcional: Botón ver todo */}
              <Link href="/collection" asChild>
                 <Text className="text-purple-400 text-sm font-semibold">Ver todas</Text>
              </Link>
            </View>

            {mostExpensiveCards.length > 0 ? (
              <FlatList
                data={mostExpensiveCards}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => `expensive-${item.id}`}
                contentContainerStyle={{ paddingHorizontal: 8, paddingRight: 8 }}
                snapToInterval={CAROUSEL_CARD_WIDTH + SPACING}
                decelerationRate="fast"
                renderItem={({ item }) => (
                  <Link
                    href={{
                      pathname: '/card/[id]',
                      params: { id: item.id, cardData: JSON.stringify(item) },
                    }}
                    asChild>
                    <View style={{ width: CAROUSEL_CARD_WIDTH, marginRight: SPACING }}>
                      {/* Badge de precio flotante encima de la carta */}
                      <View className="absolute top-2 right-2 z-10 bg-black/80 px-2 py-1 rounded-full border border-yellow-500/50">
                         <Text className="text-yellow-400 text-xs font-bold">
                            {item.price} €
                         </Text>
                      </View>
                      <Card item={item} width={CAROUSEL_CARD_WIDTH} />
                    </View>
                  </Link>
                )}
              />
            ) : <EmptySection />}
          </View>



        </View>
      </ScrollView>
    </Screen>
  );
}