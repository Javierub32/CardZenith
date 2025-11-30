import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen'; // Asumiendo que tienes este componente
import { FontAwesome, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';

export default function ProfileScreen() {
	const { signOut, userInfo, setInfo, addedInfo, user } = useAuth();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!user) return;

		// Para carga de datos adicionales si es necesario
	}, [addedInfo]);

	return (
		<Screen>
			{/* Fondo general oscuro similar a la imagen */}
			<View className="flex-1">
				<StatusBar style="light" />

				<ScrollView className="flex-1" showsVerticalScrollIndicator={false}>

					{/* Header */}
					<View className="flex-row items-center justify-between px-4 py-4">
						<Text className="text-white text-xl font-bold">Perfil</Text>
						<TouchableOpacity>
							<FontAwesome name="cog" size={24} color="white" />
						</TouchableOpacity>
					</View>

					{/* Profile Avatar Section */}
					<View className="items-center mt-4 mb-6">
						<View className="w-36 h-36 rounded-full bg-white items-center justify-center mb-4 shadow-lg shadow-purple-500/20">
							<View className="w-32 h-32 rounded-full bg-purple-600 overflow-hidden items-center justify-center border-4 border-white">
								{/* Icono de usuario grande */}
								<FontAwesome name="user" size={64} color="white" />
							</View>
						</View>

						<Text className="text-white text-2xl font-bold mb-1">
							Javier Urbaneja
						</Text>
						<Text className="text-gray-400 text-sm mb-1">{userInfo?.username}</Text>
					</View>

					{/* Botón Editar Perfil */}
					<View className="px-4 mb-8">
						<TouchableOpacity className="bg-[#8B2DF0] py-3 rounded-full items-center shadow-md shadow-purple-500/30">
							<Text className="text-white text-base font-bold">Editar Perfil</Text>
						</TouchableOpacity>
					</View>
					{/*

					{/* Gestión / Menú */}
					<View className="px-4 mb-10">
						<Text className="text-white text-lg font-bold mb-4">Gestión</Text>

						<View className="gap-3">
							<MenuOption icon="user" label="Cuenta" iconLib="FontAwesome" />
							<MenuOption icon="bell" label="Notificaciones" iconLib="FontAwesome" />
							<MenuOption icon="shield-check" label="Privacidad" iconLib="MaterialCommunityIcons" />
							<MenuOption icon="help-circle" label="Ayuda y Soporte" iconLib="MaterialCommunityIcons" />

							{/* Cerrar Sesión */}
							<TouchableOpacity className="flex-row items-center p-4 mt-2" onPress={async () => { await signOut(); }}>
								<View className="w-8 items-center mr-3">
									<MaterialCommunityIcons name="logout" size={22} color="#EF4444" />
								</View>
								<Text className="text-red-500 text-base font-semibold">Cerrar Sesión</Text>
							</TouchableOpacity>
						</View>
					</View>

				</ScrollView>
			</View>
		</Screen>
	);
}

// Componente auxiliar para las opciones del menú para no repetir código
function MenuOption({ icon, label, iconLib }: { icon: any; label: string; iconLib: 'FontAwesome' | 'MaterialCommunityIcons' }) {
	return (
		<TouchableOpacity className="flex-row items-center justify-between bg-[#231E36] p-4 rounded-xl">
			<View className="flex-row items-center">
				<View className="w-8 items-center mr-3">
					{iconLib === 'FontAwesome' ? (
						<FontAwesome name={icon} size={20} color="white" />
					) : (
						<MaterialCommunityIcons name={icon} size={22} color="white" />
					)}
				</View>
				<Text className="text-white text-base font-medium">{label}</Text>
			</View>
			<MaterialCommunityIcons name="chevron-right" size={24} color="#6B7280" />
		</TouchableOpacity>
	);
}