import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../../app/AuthContext';
import { fetch10CatImages } from '../../hooks/api';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../hooks/firebaseConfig';

const MultiSummonButton = ({ onSummon }: { onSummon: (cats: any[]) => void }) => {
  const authContext = useAuth();
  const [loading, setLoading] = useState(false);
  if (!authContext) {
    return null;
  }
  const { user, setUser } = authContext;

  const handleSummon = async () => {
    if (user && user.catcoins >= 50) {
      setLoading(true);
      try {
        const cats = await fetch10CatImages();
        const updatedUser = {
          ...user,
          catcoins: user.catcoins - 50,
          collection: [...user.collection, ...cats],
        };
        setUser(updatedUser);
        if (!auth.currentUser) return;
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userDocRef, {
          catcoins: updatedUser.catcoins,
          collection: updatedUser.collection,
        });
        onSummon(cats);
      } catch (error) {
        console.error('Error summoning cats:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const isDisabled = !user || user.catcoins < 50 || loading;

  return (
    <TouchableOpacity
      style={[styles.button, isDisabled ? styles.buttonDisabled : styles.buttonEnabled]}
      onPress={handleSummon}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Text style={isDisabled ? styles.buttonTextDisabled : styles.buttonTextEnabled}>Summon 10 Cats</Text>
      )}
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