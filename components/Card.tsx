import React, { forwardRef } from 'react';
import { View, Text, Image, Pressable, PressableProps } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface CardProps extends PressableProps {
  item: any;
  width: number;
}

// Desestructuramos 'style' de las props también
export const Card = forwardRef<View, CardProps>(({ item, width, style, ...rest }, ref) => {
  
  const getRarityColor = (rarity: string) => {
    const rarityColors: { [key: string]: string } = {
      'Common': '#9CA3AF',
      'Uncommon': '#10B981',
      'Rare': '#3B82F6',
      'Rare Holo': '#8B5CF6',
      'Double rare': '#C026D3',
      'Ultra Rare': '#F59E0B',
      'Secret Rare': '#EF4444',
      'Illustration Rare': '#F472B6',
      'Hyper Rare': '#EAB308',
    };
    return rarityColors[rarity] || '#6B7280';
  };

  return (
    <Pressable
      ref={ref}
      className="mb-4"
      // SOLUCIÓN AQUÍ: Usamos un array para combinar tu ancho con cualquier estilo externo
      style={[
        { width: width }, // 1. Aplicamos tu ancho calculado
        style as any      // 2. Aplicamos estilos que vengan del padre/Link (si los hay)
      ]}
      {...rest} 
    >
      <View className="overflow-hidden rounded-2xl bg-white/5">
        <Image
          source={{ uri: item.image_url }}
          className="h-56 w-full"
          resizeMode="contain"
        />

        <View className="p-3">
          <Text className="mb-1 text-base font-bold text-white" numberOfLines={1}>
            {item.name}
          </Text>

          <View className="mb-2 flex-row items-center justify-between">
            <Text className="text-xs text-purple-300">#{item.number}</Text>
            <View
              className="rounded-full px-2 py-1"
              style={{ backgroundColor: getRarityColor(item.rarity) }}
            >
              <MaterialCommunityIcons name="star" size={12} color="white" />
            </View>
          </View>

          <View className="rounded-lg bg-white/5 p-2">
            <Text className="text-xs text-gray-400" numberOfLines={1}>
              {item.set || 'Desconocido'}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
});