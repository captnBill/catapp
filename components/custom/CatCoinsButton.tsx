import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../../app/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../hooks/firebaseConfig';

const CatCoinsButton = () => {
  const authContext = useAuth();
  const user = authContext?.user;
  const setUser = authContext?.setUser;
  const [cooldown, setCooldown] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    const loadCooldown = async () => {
      if (user) {
        if (!auth.currentUser) return;
        const userDocRef = doc(db, 'users', auth.currentUser.uid); // Use username as the document ID
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const cooldownEnd = userDoc.data().cooldownEnd;
          if (cooldownEnd) {
            const remainingTime = new Date(cooldownEnd).getTime() - new Date().getTime();
            if (remainingTime > 0) {
              setCooldown(true);
              setRemainingTime(remainingTime);
              const interval = setInterval(() => {
                const newRemainingTime = new Date(cooldownEnd).getTime() - new Date().getTime();
                if (newRemainingTime <= 0) {
                  clearInterval(interval);
                  setCooldown(false);
                  setRemainingTime(0);
                } else {
                  setRemainingTime(newRemainingTime);
                }
              }, 1000);
              return () => clearInterval(interval);
            }
          }
        }
      }
    };

    loadCooldown();
  }, [user]);

 const handlePress = async () => {
  if (user && setUser && !cooldown) {
    try {
      const updatedUser = { ...user, catcoins: user.catcoins + 10 };
      setUser(updatedUser);

      // Set a cooldown of 60 seconds
      const cooldownEnd = new Date(new Date().getTime() + 60000).toISOString();

      if (!auth.currentUser) return;
        const userDocRef = doc(db, 'users', auth.currentUser.uid);  // Use username as the document ID
      await updateDoc(userDocRef, {
        catcoins: updatedUser.catcoins,
        cooldownEnd: cooldownEnd,
      });

      setCooldown(true);
      setRemainingTime(60000);

      const interval = setInterval(() => {
        const newRemainingTime = new Date(cooldownEnd).getTime() - new Date().getTime();
        if (newRemainingTime <= 0) {
          clearInterval(interval);
          setCooldown(false);
          setRemainingTime(0);
        } else {
          setRemainingTime(newRemainingTime);
        }
      }, 1000);
    } catch (error) {
      console.error("Error updating catcoins or cooldown:", error);
    }
  }
};

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, cooldown ? styles.buttonDisabled : styles.buttonEnabled]}
        onPress={handlePress}
        disabled={cooldown}
      >
        <Text style={styles.buttonText}>{cooldown ? 'Cooldown active...' : 'Get 10 Catcoins'}</Text>
      </TouchableOpacity>
      {cooldown && <Text style={styles.cooldownText}>Wait {Math.ceil(remainingTime / 1000)} seconds</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    alignItems: 'center',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
  },
  buttonEnabled: {
    backgroundColor: 'orange',
  },
  buttonDisabled: {
    backgroundColor: 'gray',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cooldownText: {
    marginTop: 8,
    color: 'red',
  },
});

export default CatCoinsButton;
