import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [session, setSession] = useState(null);
	const [loading, setLoading] = useState(true);
	const [addedInfo, setInfo] = useState(null); // Estado para comprobar cuando se añade info adicional y refrescar
	const [userInfo, setUserInfo] = useState([]);

	useEffect(() => {
		// Verificar sesión al inicio
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
			setUser(session ? session.user : null);
            if (!session) {
                setLoading(false); // Si no hay sesión, dejamos de cargar
                setUserInfo(null);
            }
		});

		// Escuchar cambios de sesión
		const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
			setUser(session ? session.user : null);
            if (!session) {
                setLoading(false);
                setUserInfo(null); 
            }
		});

	
		return () => subscription.unsubscribe();
	}, []);

    useEffect(() => {
        const fetchUserInfo = async () => {
            if (user) {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .maybeSingle();
                if (error) {
                    console.error('Error fetching user info:', error);
                } else {
                    setUserInfo(data);
                }
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, [user]); 

	const signIn = async (email, password) => {
		const { error } = await supabase.auth.signInWithPassword({ email, password });
		if (error) throw error;
	};

	const signUp = async (email, password, username) => {
		// 1. Crear el usuario en el sistema de Autenticación
		const { data, error: authError } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					username: username // <--- ESTO ES VITAL PARA EL TRIGGER
				}
			}
		});

		if (authError) throw authError;
		if (!data.user) throw new Error("No se pudo crear el usuario");
	};

	const signOut = async () => {
		await supabase.auth.signOut();
	};

	return (
		<AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut, addedInfo, setInfo, userInfo }}>
			{!loading && children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);