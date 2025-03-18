import { Image, StyleSheet, Platform } from 'react-native';
import React from 'react';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '../AuthContext';
import CatCoinsButton from '@/components/custom/CatCoinsButton';

export default function HomeScreen() {
  const authContext = useAuth();
  const user = authContext ? authContext.user : null;

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#FF9000', dark: '#B52800' }}
      headerImage={
        <Image
          source={require('@/assets/images/catapp logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" darkColor='hsl(45, 100%, 50%)' lightColor='hsl(25, 100%, 26%)'>
          Welcome to Catapp!
        </ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Currently logged in as:</ThemedText>
        <ThemedText>{user ? user.username : 'Guest'}</ThemedText>
        <ThemedText type="subtitle">Total cats :</ThemedText>
        <ThemedText>{user ? user.collection.length : '0'}</ThemedText>
        <ThemedText type="subtitle">Catcoins in store :</ThemedText>
        <ThemedText>{user ? user.catcoins : '0'}</ThemedText>
        <CatCoinsButton/>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 290,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});