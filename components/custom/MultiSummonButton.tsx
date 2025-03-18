import React from 'react';
import { View, Button, TouchableOpacity, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../app/AuthContext';
import { fetchCatImage } from '../../api';

const MultiSummonButton = ({ onSummon }: { onSummon: (cats: any[]) => void }) => {
  const authContext = useAuth();
  if (!authContext) {
    return null;
  }
  const { user, setUser } = authContext;

  const handleSummon = async () => {
    if (user && user.catcoins >= 50) {
      const cats = [];
      for (let i = 0; i < 10; i++) {
        const cat = await fetchCatImage();
        cats.push(cat);
      }
      const updatedUser = {
        ...user,
        catcoins: user.catcoins - 50,
        collection: [...user.collection, ...cats],
      };
      setUser(updatedUser);
      await AsyncStorage.setItem(`user:${user.username}`, JSON.stringify(updatedUser));
      onSummon(cats);
    }
  };

  const isDisabled = !user || user.catcoins < 50;

  return (
    <TouchableOpacity
      style={[styles.button, isDisabled ? styles.buttonDisabled : styles.buttonEnabled]}
      onPress={handleSummon}
      disabled={isDisabled}
    >
      <Text style={isDisabled ? styles.buttonTextDisabled : styles.buttonTextEnabled}>Summon 10 Cats</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    marginHorizontal: 8,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonEnabled: {
    backgroundColor: 'orange',
  },
  buttonDisabled: {
    backgroundColor: 'grey',
  },
  buttonTextEnabled: {
    color: 'white',
  },
  buttonTextDisabled: {
    color: 'black',
  },
});
export default MultiSummonButton;