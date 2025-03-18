// filepath: c:\Users\noegr\Documents\Cours\E5\xmobil\app\catapp2folder\catapp\components\custom\SummonDisplay.tsx
import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';

const SummonDisplay = ({ cats }: { cats: any[] }) => {
  const flipAnim = new Animated.Value(0);

  useEffect(() => {
    flipCard();
  }, [cats]);

  const flipCard = () => {
    Animated.timing(flipAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  return (
    <View style={styles.container}>
      {cats.map((cat, index) => (
        <View key={index} style={styles.cardContainer}>
          <Animated.View style={[styles.card, frontAnimatedStyle]}>
            <Image source={{ uri: cat.url }} style={styles.image} />
          </Animated.View>
          <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
            <Image source={{ uri: cat.url }} style={styles.image} />
          </Animated.View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  cardContainer: {
    margin: 10,
  },
  card: {
    width: 100,
    height: 100,
    backfaceVisibility: 'hidden',
  },
  cardBack: {
    position: 'absolute',
    top: 0,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default SummonDisplay;