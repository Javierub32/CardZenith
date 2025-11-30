import { View, Text, ScrollView, Image, Alert, ActivityIndicator, Pressable, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { useAuth } from 'context/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from 'lib/supabase';
import { Link } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 2 columnas con padding

// Cache persistente fuera del componente (persiste entre montajes)
let cachedCards: any[] = [];
let lastAddedInfo: any = null;

export default function CollectionScreen() {
	const { session, addedInfo } = useAuth();

	const [misCartas, setMisCartas] = useState<any[]>(cachedCards);
	const [loading, setLoading] = useState(false);


	useEffect(() => {
		if (!session) return;

		// Solo recargar si:
		// 1. Nunca se ha cargado (primera vez)
		// 2. addedInfo cambió (se añadió una carta nueva)
		const shouldFetch = cachedCards.length === 0 || lastAddedInfo !== addedInfo;

		if (!shouldFetch) {
			// Si ya hay datos en cache, usarlos
			if (cachedCards.length > 0 && misCartas.length === 0) {
				setMisCartas(cachedCards);
			}
			return;
		}

		const fetchCartasUsuario = async () => {
			setLoading(true);
			try {
				const { data, error } = await supabase
					.from('user_cards')
					.select(
						`
          id,
          obtained_at,
          cards (
            id,
            name,
            image_url,
            hp,
            type,
            set,
            rarity,
			number,
			autor
          )
        `
					)
					.eq('user_id', session.user.id);

				if (error) throw error;

				if (data) {
					const cartasFormateadas = data.map((item: any) => ({
						...item.cards,
						obtained_at: item.obtained_at,
						user_card_id: item.id,
					}));

					// Actualizar cache y estado
					cachedCards = cartasFormateadas;
					setMisCartas(cartasFormateadas);
					lastAddedInfo = addedInfo;
				}
			} catch (error) {
				console.error(error);
				Alert.alert('Error', 'No se pudo cargar el inventario');
			} finally {
				setLoading(false);
			}
		};

		fetchCartasUsuario();
	}, [session, addedInfo]);

	// Función para obtener el color según la rareza
	const getRarityColor = (rarity: string) => {
		const rarityColors: { [key: string]: string } = {
			'Common': '#9CA3AF',       // Gray-400
			'Uncommon': '#10B981',     // Emerald-500
			'Rare': '#3B82F6',         // Blue-500
			'Rare Holo': '#8B5CF6',    // Violet-500
			'Double rare': '#C026D3',  // Cyan-500 
			'Ultra Rare': '#F59E0B',   // Amber-500 (Gold)
			'Secret Rare': '#EF4444',  // Red-500
			'Illustration Rare': '#F472B6', // Pink-400 (Arte alternativo)
			'Hyper Rare': '#EAB308',        // Yellow-500 (Doradas completas)
		};
		return rarityColors[rarity] || '#6B7280';
	};

	// Calcular estadísticas
	const totalCards = misCartas.length;
	const uniqueSets = new Set(misCartas.map((card: any) => card.set)).size;
	const totalPrice = misCartas.reduce((sum: number, card: any) => sum + (parseInt(card.price) || 0), 0);

	if (loading) {
		return (
			<View className="flex-1 items-center justify-center bg-[#18122B]">
				<ActivityIndicator size="large" color="#8B2DF0" />
				<Text className="mt-4 font-bold text-white">Cargando colección...</Text>
			</View>
		);
	}

	if (misCartas.length === 0 && !loading) {
		return (
			<Screen>
				<StatusBar style="light" />
				<View className="flex-1 items-center justify-center p-6">
					<MaterialCommunityIcons name="cards-outline" size={100} color="#8B2DF0" />
					<Text className="mt-6 text-center text-2xl font-bold text-white">
						Tu colección está vacía
					</Text>
					<Text className="mt-3 text-center text-lg text-gray-400">
						¡Escanea tu primera carta para comenzar!
					</Text>
					<View className="mt-8 flex-row items-center rounded-full bg-white/10 px-6 py-3">
						<MaterialCommunityIcons name="camera" size={20} color="#8B2DF0" />
						<Text className="ml-2 text-white">Ve a la pestaña de cámara</Text>
					</View>
				</View>
			</Screen>
		);
	}

	return (
		<Screen>
			<StatusBar style="light" />
			<ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
				{/* Header */}
				<View className="pb-6">
					<View className="px-6 pt-6">
						<Text className="mb-2 text-center text-4xl font-bold text-white">Mi Colección</Text>
						<Text className="mb-6 text-center text-base text-purple-200">
							Tus cartas Pokémon
						</Text>

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
								<Text className="text-center text-2xl font-bold text-white">{totalPrice}</Text>
								<Text className="text-center text-xs text-gray-300">Precio total</Text>
							</View>
						</View>
					</View>
				</View>

				{/* Grid de cartas */}
				<View className="px-4 pb-6">
					<View className="flex-row flex-wrap justify-between">
						{misCartas.map((item: any, index: number) => (
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
								<Pressable
									className="mb-4"
									style={{ width: cardWidth }}>
									<View className="overflow-hidden rounded-2xl bg-white/5">
										{/* Imagen de la carta */}
										<Image
											source={{ uri: item.image_url }}
											className="h-56 w-full"
											resizeMode="contain"
										/>

										{/* Info de la carta */}
										<View className="p-3">
											<Text className="mb-1 text-base font-bold text-white" numberOfLines={1}>
												{item.name}
											</Text>

											<View className="mb-2 flex-row items-center justify-between">
												<Text className="text-xs text-purple-300">#{item.number}</Text>

												{/* Badge de rareza */}
												<View
													className="rounded-full px-2 py-1"
													style={{ backgroundColor: getRarityColor(item.rarity) }}>
													<MaterialCommunityIcons name="star" size={12} color="white" />
												</View>
											</View>

											{/* Set */}
											<View className="rounded-lg bg-white/5 p-2">
												<Text className="text-xs text-gray-400" numberOfLines={1}>
													{item.set || 'Desconocido'}
												</Text>
											</View>
										</View>
									</View>
								</Pressable>
							</Link>
						))}
					</View>
				</View>
			</ScrollView>
		</Screen>
	);
}
