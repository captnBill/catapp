import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { View, Button, Text, TextInput, StyleSheet, useWindowDimensions } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, query, where, collection, getDocs } from 'firebase/firestore';

interface Cat {
  url: string;
  width: number;
  height: number;
}

interface User {
  username: string;
  email: string;
  catcoins: number;
  collection: Cat[];
  cooldownEnd?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (identifier: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data() as User);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (identifier: string, password: string) => {
    let email = identifier;

    // Check if the identifier is a username
    if (!identifier.includes('@')) {
      const q = query(collection(db, 'users'), where('username', '==', identifier));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        email = querySnapshot.docs[0].data().email;
      } else {
        throw new Error('Username not found');
      }
    }

    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (username: string, email: string, password: string) => {
    // Check if the username is already in use
    const q = query(collection(db, 'users'), where('username', '==', username));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      throw new Error('Username already in use');
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const newUser: User = {
      username,
      email,
      catcoins: 0,
      collection: [],
    };
    await setDoc(doc(db, 'users', userCredential.user.uid), newUser);
    setUser(newUser);
  };

  const logout = async () => {
    await signOut(auth);
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
  const [identifier, setIdentifier] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { colors } = useTheme();
  const { width } = useWindowDimensions();

  const handleSubmit = async () => {
    try {
      if (type === 'login') {
        await login?.(identifier, password);
      } else {
        await register?.(username, email, password);
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
      {type === 'register' && (
        <>
          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            style={[styles.input, { borderColor: colors.border, color: colors.text, width: width * 0.8 }]}
            placeholderTextColor={colors.text}
            textAlign="left"
          />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={[styles.input, { borderColor: colors.border, color: colors.text, width: width * 0.8 }]}
            placeholderTextColor={colors.text}
            textAlign="left"
          />
        </>
      )}
      {type === 'login' && (
        <TextInput
          placeholder="Username or Email"
          value={identifier}
          onChangeText={setIdentifier}
          style={[styles.input, { borderColor: colors.border, color: colors.text, width: width * 0.8 }]}
          placeholderTextColor={colors.text}
          textAlign="left"
        />
      )}
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

export default AuthProvider;