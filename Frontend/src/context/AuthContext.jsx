import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await api.get('/auth/me');
                    if (response.data.success) {
                        setUser(response.data.data.user);
                    }
                } catch (error) {
                    console.error('Auth check failed:', error);
                    localStorage.removeItem('token');
                    setUser(null);
                }
            }
            setLoading(false);
        };

        checkUser();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            if (response.data.success) {
                const { token, user } = response.data.data;
                localStorage.setItem('token', token);
                setUser(user);
                toast.success('Login successful!');
                return { success: true };
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            toast.error(message);
            return { success: false, message };
        }
    };

    const signup = async (userData) => {
        try {
            const response = await api.post('/auth/signup', userData);
            if (response.data.success) {
                const { token, user } = response.data.data;
                localStorage.setItem('token', token);
                setUser(user);
                toast.success('Account created successfully!');
                return { success: true };
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Signup failed';
            toast.error(message);
            return { success: false, message };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        toast.success('Logged out successfully');
        window.location.href = '/login';
    };

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};
