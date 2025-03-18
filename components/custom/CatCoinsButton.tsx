import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../app/AuthContext';

const CatCoinsButton = () => {
  const authContext = useAuth();
  const user = authContext?.user;
  const setUser = authContext?.setUser;
  const [cooldown, setCooldown] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    const loadCooldown = async () => {
      if (user) {
        const cooldownEnd = await AsyncStorage.getItem(`cooldownEnd:${user.username}`);
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
    };
    loadCooldown();
  }, [user]);

  const handlePress = async () => {
    if (user && setUser && !cooldown) {
      const updatedUser = { ...user, catcoins: user.catcoins + 10 };
      setUser(updatedUser);
      await AsyncStorage.setItem(`user:${user.username}`, JSON.stringify(updatedUser));
      setCooldown(true);
      const cooldownEnd = new Date(new Date().getTime() + 60000).toISOString();
      await AsyncStorage.setItem(`cooldownEnd:${user.username}`, cooldownEnd);
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
    }
  };

  const getButtonStyle = () => {
    if (!cooldown) {
      return styles.buttonEnabled;
    }
    const percentage = remainingTime / 60000;
    const backgroundColor = `rgba(255, 165, 0, ${1 - percentage})`;
    return [styles.buttonDisabled, { backgroundColor }];
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.button, getButtonStyle()]} onPress={handlePress} disabled={cooldown}>
        <Text style={cooldown ? styles.buttonTextDisabled : styles.buttonTextEnabled}>Get 10 Catcoins</Text>
      </TouchableOpacity>
      {cooldown && <Text style={styles.cooldownText}>Cooldown active, please wait...</Text>}
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
    backgroundColor: 'darkgrey',
  },
  buttonTextEnabled: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonTextDisabled: {
    color: 'black',
    fontWeight: 'bold',
  },
  cooldownText: {
    marginTop: 8,
    color: 'red',
  },
});

export default CatCoinsButton;