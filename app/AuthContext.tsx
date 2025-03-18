import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Button, Text, TextInput, StyleSheet, useWindowDimensions } from 'react-native';
import { useTheme } from '@react-navigation/native';

interface Cat {
  url: string;
  width: number;
  height: number;
}

interface User {
  username: string;
  catcoins: number;
  collection: Cat[];
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };
    loadUser();
  }, []);

  const login = async (username: string, password: string) => {
    const storedPassword = await AsyncStorage.getItem(`user:${username}:password`);
    if (storedPassword === password) {
      const storedUser = await AsyncStorage.getItem(`user:${username}`);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const register = async (username: string, password: string) => {
    const existingUser = await AsyncStorage.getItem(`user:${username}`);
    if (existingUser) {
      throw new Error('User already exists');
    }
    const newUser: User = {
      username,
      catcoins: 0,
      collection: [],
    };
    await AsyncStorage.setItem(`user:${username}`, JSON.stringify(newUser));
    await AsyncStorage.setItem(`user:${username}:password`, password);
    setUser(newUser);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export const AuthButton = () => {
  const authContext = useAuth();
  const { user, logout } = authContext || {};

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {user ? (
        <>
          <Text>Welcome, {user.username}</Text>
          <Button title="Logout" onPress={logout} />
        </>
      ) : (
        <Text>Please log in to continue</Text>
      )}
    </View>
  );
};

export const AuthForm = ({ type }: { type: 'login' | 'register' }) => {
  const authContext = useAuth();
  const { login, register } = authContext || {};
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { colors } = useTheme();
  const { width } = useWindowDimensions();

  const handleSubmit = async () => {
    try {
      if (type === 'login') {
        await login?.(username, password);
      } else {
        await register?.(username, password);
      }
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={[styles.input, { borderColor: colors.border, color: colors.text, width: width * 0.8 }]}
        placeholderTextColor={colors.text}
        textAlign="left"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={[styles.input, { borderColor: colors.border, color: colors.text, width: width * 0.8 }]}
        placeholderTextColor={colors.text}
        textAlign="left"
      />
      {error && <Text style={[styles.error, { color: colors.notification }]}>{error}</Text>}
      <Button title={type === 'login' ? 'Login' : 'Register'} onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  input: {
    padding: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderRadius: 4,
  },
  error: {
    marginVertical: 8,
  },
});

// Export default to avoid the missing default export warning
export default AuthProvider;