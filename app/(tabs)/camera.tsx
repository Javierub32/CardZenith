import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera'; 
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../lib/supabase'; // Asegúrate que la ruta sea correcta
import { useAuth } from 'context/AuthContext';


export default function CameraScannerScreen() {
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();
  
  const [photo, setPhoto] = useState(null); // Foto local tomada
  const [torch, setTorch] = useState(false);
  
  // Estados para la lógica de API y Guardado
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState(null); // Aquí guardamos la respuesta del backend
  const {addedInfo, setInfo } = useAuth();

  const cameraRef = useRef(null);

  if (!permission) return <View className="flex-1 bg-black" />;

  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 bg-[#18122B] items-center justify-center px-6">
        <MaterialCommunityIcons name="camera-off" size={60} color="#6B7280" />
        <Text className="text-white text-xl font-bold mt-4 text-center">Permiso requerido</Text>
        <Text className="text-gray-400 text-center mt-2 mb-8">
          Necesitamos acceso a tu cámara para escanear cartas.
        </Text>
        <TouchableOpacity 
          onPress={requestPermission}
          className="bg-[#8B2DF0] py-3 px-8 rounded-full"
        >
          <Text className="text-white font-bold text-lg">Dar Permiso</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photoData = await cameraRef.current.takePictureAsync({
          quality: 0.7, // Bajamos un poco la calidad para subir más rápido
          base64: false, // No necesitamos base64 local, enviaremos el archivo
          skipProcessing: true,
        });
        setPhoto(photoData.uri);
      } catch (error) {
        Alert.alert("Error", "No se pudo capturar la imagen.");
      }
    }
  };

  // 1. Función para enviar la foto al Backend
  const processImageWithApi = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: photo,
        name: 'carta.jpg',
        type: 'image/jpeg',
      });

      const response = await fetch('https://javierub-api-cardzenith.hf.space/procesar', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await response.json();

      if (!data.error || data.error != "False") {
        Alert.alert("Error", data.error);
        setLoading(false);
        return;
      }

      // Si todo va bien, guardamos la respuesta para mostrar la preview
      setApiResponse(data);

    } catch (error) {
      console.error(error);
      Alert.alert("Error de conexión", "No se pudo conectar con el servidor de reconocimiento.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Función para guardar en Supabase (Cartas y User_Cards)
  const saveToDatabase = async () => {
    if (!apiResponse || !apiResponse.carta_api) return;

    setLoading(true);
    const cardData = apiResponse.carta_api;

    try {
      // A. Verificar si la carta ya existe en el catálogo global 'cards'
      // Buscamos por nombre y número para evitar duplicados en el catálogo
      const { data: existingCard, error: searchError } = await supabase
        .from('cards')
        .select('id')
        .eq('name', cardData.name)
        .eq('number', cardData.number) // Usando 'number' como identificador único extra si existe esa columna, o usa otra lógica
        .maybeSingle();


      let cardId;

      if (existingCard) {
        cardId = existingCard.id;
      } else {
        // B. Si no existe, la creamos
        const { data: newCard, error: insertError } = await supabase
          .from('cards')
          .insert({
            name: cardData.name,
            hp: parseInt(cardData.hp) || 0,
            image_url: cardData.image_url,
            type: cardData.type,
			set: cardData.set,
			number: cardData.number,
			autor: cardData.illustrator,
			setLogo: cardData.set_logo,
			rarity: cardData.rarity,
			price: parseFloat(cardData.price) || 0
          })
          .select()
          .single();

        if (insertError) throw insertError;
        cardId = newCard.id;
      }

      // C. Añadir al inventario del usuario ('user_cards')
      // Usamos upsert para manejar si ya la tiene (incrementar cantidad si tienes esa lógica, o ignorar)
      // Como configuramos UNIQUE(user_id, card_id), esto fallará si ya la tiene si no usamos onConflict
      
      const { error: inventoryError } = await supabase
        .from('user_cards')
        .insert({
            card_id: cardId,
            // user_id se llena solo con el default auth.uid() que configuramos
            // obtained_at se llena solo con now()
        });

      if (inventoryError) {
        if(inventoryError.code === '23505') { // Código de duplicado en Postgres
             Alert.alert("Aviso", "Ya tienes esta carta en tu colección.");
        } else {
            throw inventoryError;
        }
      } else {
        Alert.alert("¡Éxito!", `Has añadido a ${cardData.name} a tu colección.`);
      }

      // Limpiar y volver a cámara
      setApiResponse(null);
      setPhoto(null);
	  setInfo(true);
	  setInfo(false);
      
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error Base de Datos", error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- VISTA 1: CARGANDO ---
  if (loading) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator size="large" color="#8B2DF0" />
        <Text className="text-white mt-4 font-bold">Procesando carta...</Text>
      </View>
    );
  }

  // --- VISTA 2: RESULTADO DE LA API (CONFIRMACIÓN) ---
  if (apiResponse && apiResponse.carta_api) {
    // La API devuelve la imagen en base64 raw, hay que añadirle el header
    const base64Image = `data:image/jpeg;base64,${apiResponse.carta_api.image_base64}`;

    return (
      <View className="flex-1 bg-[#18122B] px-4 pt-10">
        <Text className="text-white text-2xl font-bold text-center pt-8">¿Es esta tu carta?</Text>
        
        {/* Imagen devuelta por el Backend */}
        <View className="flex-1 items-center justify-center ">
            <Image 
                source={{ uri: base64Image }} 
                className="w-full h-[85%] rounded-xl" 
                resizeMode="contain" 
            />
        </View>

        {/* Datos detectados */}
        <View className="bg-white/10 p-4 rounded-lg mb-6">
            <Text className="text-white text-lg font-bold">{apiResponse.carta_api.name}</Text>
            <Text className="text-gray-300">HP: {apiResponse.carta_api.hp}</Text>
            <Text className="text-gray-300">Set: {apiResponse.carta_api.set}</Text>
			<Text className="text-gray-300">Número: {apiResponse.carta_api.number}</Text>
			<Text className="text-gray-300">Tipo: {apiResponse.carta_api.type}</Text>
			<Text className="text-gray-300">Rareza: {apiResponse.carta_api.rarity}</Text>
        </View>

        <View className="flex-row gap-4 mb-12">
          <TouchableOpacity 
            onPress={() => setApiResponse(null)} // Cancelar, volvemos a la foto local
            className="flex-1 bg-gray-600 py-4 rounded-xl items-center"
          >
            <Text className="text-white font-bold">Cancelar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={saveToDatabase} 
            className="flex-1 bg-green-600 py-4 rounded-xl items-center"
          >
            <Text className="text-white font-bold">Confirmar y Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // --- VISTA 3: CONFIRMACIÓN DE FOTO LOCAL (ANTES DE ENVIAR) ---
  if (photo) {
    return (
      <View className="flex-1 bg-black">
        <StatusBar style="light" />
        <Image source={{ uri: photo }} className="flex-1" resizeMode="contain" />
        <View className="absolute bottom-0 left-0 right-0 bg-black/60 p-6 flex-row gap-4 pb-14">
          <TouchableOpacity 
            onPress={() => setPhoto(null)} 
            className="flex-1 bg-gray-700 py-4 rounded-xl items-center flex-row justify-center"
          >
            <FontAwesome5 name="redo" size={16} color="white" style={{marginRight: 8}} />
            <Text className="text-white font-bold">Repetir</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={processImageWithApi} 
            className="flex-1 bg-[#8B2DF0] py-4 rounded-xl items-center flex-row justify-center"
          >
            <FontAwesome5 name="cloud-upload-alt" size={16} color="white" style={{marginRight: 8}} />
            <Text className="text-white font-bold">Analizar Carta</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // --- VISTA 4: CÁMARA (DEFAULT) ---
  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />
      
      <CameraView 
        style={StyleSheet.absoluteFill} 
        facing="back"
        enableTorch={torch} 
        ref={cameraRef}
      />

      <SafeAreaView 
        className="flex-1 justify-between" 
        style={StyleSheet.absoluteFill}
      >
        <View className="flex-row justify-between items-center px-4 pt-2 z-50">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="w-10 h-10 items-center justify-center bg-black/40 rounded-full"
          >
            <FontAwesome5 name="times" size={20} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => setTorch(!torch)}
            className="w-10 h-10 items-center justify-center bg-black/40 rounded-full"
          >
            <MaterialCommunityIcons 
              name={torch ? "flash" : "flash-off"} 
              size={24} 
              color={torch ? "#FFD700" : "white"} 
            />
          </TouchableOpacity>
        </View>

        <View className="flex-1 px-6 items-center justify-center z-10 pointer-events-none">
          <View className="w-[85%] aspect-[3/4] relative">
            <View className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-[#8B2DF0] rounded-tl-lg" />
            <View className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-[#8B2DF0] rounded-tr-lg" />
            <View className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-[#8B2DF0] rounded-bl-lg" />
            <View className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-[#8B2DF0] rounded-br-lg" />
            
            <View className="absolute -top-16 w-full items-center">
              <Text className="text-white shadow-lg shadow-black font-bold text-lg bg-black/30 px-2 rounded">
                Encuadra la carta
              </Text>
            </View>
          </View>
        </View>

        <View className="h-32 items-center justify-center bg-gradient-to-t from-black/80 to-transparent z-50">
          <TouchableOpacity 
            onPress={takePicture}
            className="w-20 h-20 rounded-full border-4 border-white items-center justify-center bg-white/20"
          >
            <View className="w-16 h-16 bg-white rounded-full" />
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </View>
  );
}