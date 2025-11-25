import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera'; 
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export default function CameraScannerScreen() {
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  
  // CAMBIO 1: Usamos un booleano para la linterna (Torch) en lugar del modo flash
  const [torch, setTorch] = useState(false); 
  
  const cameraRef = useRef(null);

  if (!permission) return <View className="flex-1 bg-black" />;

  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 bg-[#18122B] items-center justify-center px-6">
        <MaterialCommunityIcons name="camera-off" size={60} color="#6B7280" />
        <Text className="text-white text-xl font-bold mt-4 text-center">Permiso requerido</Text>
        <Text className="text-gray-400 text-center mt-2 mb-8">
          Necesitamos acceso a tu cámara para escanear documentos.
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
          quality: 0.8,
          base64: true,
          skipProcessing: true,
        });
        setPhoto(photoData.uri);
      } catch (error) {
        Alert.alert("Error", "No se pudo capturar la imagen.");
      }
    }
  };

  const handleUsePhoto = () => {
    Alert.alert("Foto capturada", "Procesando documento...");
    // navigation.navigate('Resultados', { imageUri: photo });
  };

  if (photo) {
    return (
      <View className="flex-1 bg-black">
        <StatusBar style="light" />
        <Image source={{ uri: photo }} className="flex-1" resizeMode="contain" />
        <View className="absolute bottom-0 left-0 right-0 bg-black/60 p-6 flex-row gap-4 pb-10">
          <TouchableOpacity 
            onPress={() => setPhoto(null)} 
            className="flex-1 bg-gray-700 py-4 rounded-xl items-center flex-row justify-center"
          >
            <FontAwesome5 name="redo" size={16} color="white" style={{marginRight: 8}} />
            <Text className="text-white font-bold">Repetir</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleUsePhoto} 
            className="flex-1 bg-[#8B2DF0] py-4 rounded-xl items-center flex-row justify-center"
          >
            <FontAwesome5 name="check" size={16} color="white" style={{marginRight: 8}} />
            <Text className="text-white font-bold">Usar Foto</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />
      
      {/* CAMBIO 2: Usamos la prop enableTorch */}
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
        
        {/* Header Superior */}
        <View className="flex-row justify-between items-center px-4 pt-2 z-50">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="w-10 h-10 items-center justify-center bg-black/40 rounded-full"
          >
            <FontAwesome5 name="times" size={20} color="white" />
          </TouchableOpacity>
          
          {/* CAMBIO 3: Lógica del botón actualizada para el booleano */}
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

        {/* ÁREA CENTRAL */}
        <View className="flex-1 px-6 items-center justify-center z-10 pointer-events-none">
          <View className="w-[85%] aspect-[3/4] relative">
            <View className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-[#8B2DF0] rounded-tl-lg" />
            <View className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-[#8B2DF0] rounded-tr-lg" />
            <View className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-[#8B2DF0] rounded-bl-lg" />
            <View className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-[#8B2DF0] rounded-br-lg" />
            
            <View className="absolute -top-16 w-full items-center">
              <Text className="text-white  shadow-lg shadow-black">
                Encuadra la carta dentro del marco
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
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