import React from 'react';
import { View, Button, TouchableOpacity, Text, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../app/AuthContext';
import { fetchCatImage } from '../../api';

const SingleSummonButton = ({ onSummon }: { onSummon: (cat: any) => void }) => {
  const authContext = useAuth();
  if (!authContext) {
    return null;
  }
  const { user, setUser } = authContext;

  const handleSummon = async () => {
    if (user && user.catcoins >= 5) {
      const cat = await fetchCatImage();
      const updatedUser = {
        ...user,
        catcoins: user.catcoins - 5,
        collection: [...user.collection, cat],
      };
      setUser(updatedUser);
      await AsyncStorage.setItem(`user:${user.username}`, JSON.stringify(updatedUser));
      onSummon(cat);
    }
  };

  const isDisabled = !user || user.catcoins < 5;

  return (
    <TouchableOpacity
      style={[styles.button, isDisabled ? styles.buttonDisabled : styles.buttonEnabled]}
      onPress={handleSummon}
      disabled={isDisabled}
    >
      <Text style={isDisabled ? styles.buttonTextDisabled : styles.buttonTextEnabled}>Summon 1 Cat</Text>
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

export default SingleSummonButton;