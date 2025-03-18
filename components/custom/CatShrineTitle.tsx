import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const TITLE_TEXT = "THE GREAT CAT SHRINE";

const CatShrineTitle = () => {
  const animations = useRef(TITLE_TEXT.split('').map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const animate = (index: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animations[index], {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(animations[index], {
            toValue: 0,
            duration: 1000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    };

    animations.forEach((_, index) => {
      setTimeout(() => animate(index), index * 100);
    });
  }, [animations]);

  return (
    <View style={styles.container}>
      {TITLE_TEXT.split('').map((letter, index) => {
        const translateY = animations[index].interpolate({
          inputRange: [0, 1],
          outputRange: [0, -10],
        });

        const hue = animations[index].interpolate({
          inputRange: [0, 1],
          outputRange: [0, 360],
        });

        const animatedStyle = {
          transform: [{ translateY }],
          color: hue.interpolate({
            inputRange: [0, 360],
            outputRange: ['hsl(45, 100%, 50%)', 'hsl(25, 100%, 26%)'],
          }),
        };

        return (
          <Animated.Text key={index} style={[styles.letter, animatedStyle]}>
            {letter}
          </Animated.Text>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  letter: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default CatShrineTitle;