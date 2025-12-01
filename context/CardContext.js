import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const CardsContext = createContext();

export const CardProvider = ({ children }) => {
    const { session, addedInfo } = useAuth(); // Tu disparador (trigger)
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Para evitar recargas innecesarias al cambiar entre pantallas
    const [isLoaded, setIsLoaded] = useState(false); 

    useEffect(() => {
        // 1. Si no hay sesión, vaciamos cartas
        if (!session) {
            setCards([]);
            setIsLoaded(false);
            return;
        }

        // 2. Lógica de caché inteligente:
        // Solo hacemos fetch si:
        // A. No hemos cargado datos nunca (isLoaded false)
        // B. O si 'addedInfo' ha cambiado (significa que subiste una carta nueva)
        
        const fetchCards = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('user_cards')
                    .select(`
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
                            autor,
                            price
                        )
                    `)
                    .eq('user_id', session.user.id);

                if (error) throw error;

                if (data) {
                    const formattedCards = data.map((item) => ({
                        ...item.cards,
                        obtained_at: item.obtained_at,
                        user_card_id: item.id,
                    }));
                    setCards(formattedCards);
                    setIsLoaded(true);
                }
            } catch (err) {
                console.error("Error cargando cartas:", err);
            } finally {
                setLoading(false);
            }
        };

        // Si ya tenemos datos y addedInfo no cambió, NO hacemos nada (usamos caché)
        // Pero como 'addedInfo' está en el array de dependencias, este useEffect
        // se ejecutará automáticamente cuando addedInfo cambie.
        fetchCards();

    }, [session, addedInfo]);



	return (
        <CardsContext.Provider value={{ cards, loading, isLoaded }}>
            {children}
        </CardsContext.Provider>
    );
};

export const useCard = () => useContext(CardsContext);