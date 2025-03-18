import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../../app/AuthContext';
import { fetchCatImage } from '../../api';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';

const SingleSummonButton = ({ onSummon }: { onSummon: (cat: any) => void }) => {
  const authContext = useAuth();
  const [loading, setLoading] = useState(false);
  if (!authContext) {
    return null;
  }
  const { user, setUser } = authContext;

  const handleSummon = async () => {
    if (user && user.catcoins >= 5) {
      setLoading(true);
      try {
        const cat = await fetchCatImage();
        const updatedUser = {
          ...user,
          catcoins: user.catcoins - 5,
          collection: [...user.collection, cat],
        };
        setUser(updatedUser);
        if (!auth.currentUser) return;
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userDocRef, {
          catcoins: updatedUser.catcoins,
          collection: updatedUser.collection,
        });
        onSummon(cat);
      } catch (error) {
        console.error('Error summoning cat:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const isDisabled = !user || user.catcoins < 5 || loading;

  return (
    <TouchableOpacity
      style={[styles.button, isDisabled ? styles.buttonDisabled : styles.buttonEnabled]}
      onPress={handleSummon}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Text style={isDisabled ? styles.buttonTextDisabled : styles.buttonTextEnabled}>Summon 1 Cat</Text>
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

export default SingleSummonButton;