import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

// IMPORTACIONES NUEVAS
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../lib/supabase'; // Asegúrate de que la ruta sea correcta
import { useAuth } from '../../context/AuthContext'; // Tu contexto
import { useCard } from 'context/CardContext';

export default function ProfileScreen() {
  // Extraemos setUserInfo para actualizar la UI globalmente sin recargar
  const { signOut, userInfo, setUserInfo, user } = useAuth();
  const { cards, loading } = useCard();

  const [uploading, setUploading] = useState(false);

  const uploadAvatar = async () => {
    try {
      // 1. Pedir permiso y seleccionar foto
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true, // Permite recortar
        aspect: [1, 1], // Formato cuadrado perfecto para perfil
        quality: 0.5, // Calidad media para no saturar la red
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      setUploading(true);
      const image = result.assets[0];

      // 2. Preparar el archivo para Supabase (Truco para React Native)
      // Supabase necesita un ArrayBuffer o Blob, no la URI directa
      const response = await fetch(image.uri);
      const blob = await response.blob();
      const arrayBuffer = await new Response(blob).arrayBuffer();

      // 3. Definir ruta: ID_USUARIO/avatar.png
      // Usamos siempre el mismo nombre para sobrescribir la anterior y ahorrar espacio
      const fileName = 'avatar.png';
      const filePath = `${user.id}/${fileName}`;

      // 4. Subir al Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, arrayBuffer, {
          contentType: image.mimeType || 'image/png',
          upsert: true, // IMPORTANTE: Sobrescribe si ya existe
        });

      if (uploadError) throw uploadError;

      // 5. Obtener la URL Pública
      // Añadimos un timestamp (?t=...) para que React Native sepa que la imagen cambió
      // y no muestre la versión vieja guardada en caché.
      const {
        data: { publicUrl },
      } = supabase.storage.from('avatars').getPublicUrl(filePath);

      const publicUrlWithCacheBuster = `${publicUrl}?t=${new Date().getTime()}`;

      // 6. Guardar la URL limpia en la Base de Datos
      const { error: dbError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl }) // Guardamos la URL base sin el timestamp
        .eq('id', user.id);

      if (dbError) throw dbError;

      // 7. ACTUALIZAR EL CONTEXTO GLOBAL
      // Esto hace que la foto cambie instantáneamente en toda la app
      if (userInfo) {
        setUserInfo({
          ...userInfo,
          avatar_url: publicUrlWithCacheBuster,
        });
      }

      Alert.alert('Éxito', 'Foto de perfil actualizada');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  // Calcular estadísticas usando los datos del contexto
  const totalCards = cards.length;
  const uniqueSets = new Set(cards.map((card) => card.set)).size;
  const totalPrice = cards.reduce((sum, card) => {
    const price = parseFloat(card.price);
    return sum + (isNaN(price) ? 0 : price);
  }, 0);

  return (
    <Screen>
      <View className="flex-1">
        <StatusBar style="light" />
        
        <View className="absolute top-0 left-0 right-0 h-96">
          <LinearGradient
            colors={['rgba(139, 45, 240, 0.15)', 'transparent']}
            style={{ flex: 1 }}
          />
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 py-4">
            <Text className="text-xl font-bold text-white">Perfil</Text>
            <TouchableOpacity>
              <FontAwesome name="cog" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* SECCIÓN DEL AVATAR */}
          <View className="mb-6 mt-4 items-center">
            {/* Botón que envuelve la imagen */}
            <TouchableOpacity
              onPress={uploadAvatar}
              disabled={uploading}
              className="mb-4 h-36 w-36 items-center justify-center rounded-full bg-white shadow-lg shadow-purple-500/20">
              <View className="relative h-[9rem] w-[9rem] items-center justify-center overflow-hidden rounded-full border-4 border-white bg-purple-600">
                {uploading ? (
                  <ActivityIndicator size="large" color="#ffffff" />
                ) : (
                  <>
                    {userInfo?.avatar_url ? (
                      <Image
                        source={{ uri: userInfo.avatar_url }}
                        className="h-full w-full"
                        resizeMode="cover"
                      />
                    ) : (
                      <FontAwesome name="user" size={64} color="white" />
                    )}

                    {/* Overlay pequeño de cámara para indicar edición */}
                    <View className="absolute bottom-0 h-8 w-full items-center justify-center bg-black/40">
                      <FontAwesome name="camera" size={14} color="white" />
                    </View>
                  </>
                )}
              </View>
            </TouchableOpacity>

            {/* Datos del Usuario desde el Contexto */}
            <Text className="mb-1 text-2xl font-bold text-white">
              {userInfo?.username || 'Usuario'}
            </Text>
            <Text className="mb-1 text-sm text-gray-400">{user?.email}</Text>
          </View>

          {/* Resto de tu UI (sin cambios) */}
          <View className="mb-8 px-4">
            <TouchableOpacity className="items-center rounded-full bg-[#8B2DF0] py-3 shadow-md shadow-purple-500/30">
              <Text className="text-base font-bold text-white">Editar Perfil</Text>
            </TouchableOpacity>
          </View>
          {/* Estadísticas */}
          <View className="flex-row gap-3 pb-4 px-4">
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

          <View className="mb-10 px-4">
            <Text className="mb-4 text-lg font-bold text-white">Gestión</Text>
            <View className="gap-3">
              <MenuOption icon="user" label="Cuenta" iconLib="FontAwesome" />
              <MenuOption icon="bell" label="Notificaciones" iconLib="FontAwesome" />
              <MenuOption icon="shield-check" label="Privacidad" iconLib="MaterialCommunityIcons" />
              <MenuOption
                icon="help-circle"
                label="Ayuda y Soporte"
                iconLib="MaterialCommunityIcons"
              />

              <TouchableOpacity className="mt-2 flex-row items-center p-4" onPress={signOut}>
                <View className="mr-3 w-8 items-center">
                  <MaterialCommunityIcons name="logout" size={22} color="#EF4444" />
                </View>
                <Text className="text-base font-semibold text-red-500">Cerrar Sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </Screen>
  );
}

// Componente auxiliar (sin cambios)
function MenuOption({
  icon,
  label,
  iconLib,
}: {
  icon: any;
  label: string;
  iconLib: 'FontAwesome' | 'MaterialCommunityIcons';
}) {
  return (
    <TouchableOpacity className="flex-row items-center justify-between rounded-xl bg-[#231E36] p-4">
      <View className="flex-row items-center">
        <View className="mr-3 w-8 items-center">
          {iconLib === 'FontAwesome' ? (
            <FontAwesome name={icon} size={20} color="white" />
          ) : (
            <MaterialCommunityIcons name={icon} size={22} color="white" />
          )}
        </View>
        <Text className="text-base font-medium text-white">{label}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={24} color="#6B7280" />
    </TouchableOpacity>
  );
}
