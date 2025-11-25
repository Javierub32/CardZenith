import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen'; // Asumiendo que tienes este componente
import { FontAwesome, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
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
            <Text className="text-gray-400 text-sm mb-1">void_rider#8821</Text>
            <Text className="text-gray-500 text-xs">Miembro desde Ene 2023</Text>
          </View>

          {/* Botón Editar Perfil */}
          <View className="px-4 mb-8">
            <TouchableOpacity className="bg-[#8B2DF0] py-3 rounded-full items-center shadow-md shadow-purple-500/30">
              <Text className="text-white text-base font-bold">Editar Perfil</Text>
            </TouchableOpacity>
          </View>

          {/* Stats Grid */}
          <View className="px-4 mb-6 gap-4">
            <View className="flex-row gap-4">
              {/* Card: Cartas Totales */}
              <View className="flex-1 bg-[#2A223E] p-4 rounded-2xl">
                <Text className="text-gray-300 text-xs mb-2">Cartas Totales</Text>
                <Text className="text-white text-2xl font-bold">1,482</Text>
              </View>
              {/* Card: Cartas Únicas */}
              <View className="flex-1 bg-[#2A223E] p-4 rounded-2xl">
                <Text className="text-gray-300 text-xs mb-2">Cartas Únicas</Text>
                <Text className="text-white text-2xl font-bold">730</Text>
              </View>
            </View>
            {/* Card: Valor Mazo */}
            <View className="bg-[#2A223E] p-4 rounded-2xl">
              <Text className="text-gray-300 text-xs mb-2">Valor Mazo</Text>
              <Text className="text-white text-2xl font-bold">$5,821</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View className="px-4 mb-8">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-white text-sm font-semibold">Último Set Completado</Text>
              <Text className="text-[#BC7AF9] text-sm font-bold">75%</Text>
            </View>
            {/* Barra de fondo */}
            <View className="h-2 bg-[#2A223E] rounded-full overflow-hidden">
              {/* Barra de progreso */}
              <View className="h-full w-3/4 bg-[#8B2DF0] rounded-full" />
            </View>
          </View>

          {/* Logros Recientes */}
          <View className="px-4 mb-8">
            <Text className="text-white text-lg font-bold mb-4">Logros Recientes</Text>
            <View className="flex-row justify-between px-2">
              {/* Logro 1 */}
              <View className="items-center w-1/4">
                <View className="w-14 h-14 bg-[#352b4d] rounded-full items-center justify-center mb-2">
                  <MaterialCommunityIcons name="trophy-variant" size={28} color="#FFD700" />
                </View>
                <Text className="text-gray-400 text-[10px] text-center">Primer{'\n'}Intercambio</Text>
              </View>
              {/* Logro 2 */}
              <View className="items-center w-1/4">
                <View className="w-14 h-14 bg-[#352b4d] rounded-full items-center justify-center mb-2">
                  <MaterialCommunityIcons name="seal" size={28} color="#FFD700" />
                </View>
                <Text className="text-gray-400 text-[10px] text-center">Maestro de{'\n'}Colección</Text>
              </View>
              {/* Logro 3 */}
              <View className="items-center w-1/4">
                <View className="w-14 h-14 bg-[#352b4d] rounded-full items-center justify-center mb-2">
                  <FontAwesome name="star" size={26} color="#FFD700" />
                </View>
                <Text className="text-gray-400 text-[10px] text-center">Especialista{'\n'}de Set</Text>
              </View>
              {/* Logro 4 (Bloqueado) */}
              <View className="items-center w-1/4">
                <View className="w-14 h-14 bg-[#252033] rounded-full items-center justify-center mb-2 border border-gray-700">
                  <FontAwesome name="lock" size={24} color="#666" />
                </View>
                <Text className="text-gray-600 text-[10px] text-center">Bloqueado</Text>
              </View>
            </View>
          </View>

          {/* Gestión / Menú */}
          <View className="px-4 mb-10">
            <Text className="text-white text-lg font-bold mb-4">Gestión</Text>
            
            <View className="gap-3">
              <MenuOption icon="user" label="Cuenta" iconLib="FontAwesome" />
              <MenuOption icon="bell" label="Notificaciones" iconLib="FontAwesome" />
              <MenuOption icon="shield-check" label="Privacidad" iconLib="MaterialCommunityIcons" />
              <MenuOption icon="help-circle" label="Ayuda y Soporte" iconLib="MaterialCommunityIcons" />

              {/* Cerrar Sesión */}
              <TouchableOpacity className="flex-row items-center p-4 mt-2">
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