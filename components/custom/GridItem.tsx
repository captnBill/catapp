import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';

const GridItem = ({ item, onPress }: { item: any; onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} style={styles.gridItem}>
    <Image source={{ uri: item.url }} style={styles.image} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  gridItem: {
    flex: 1,
    margin: 5,
    aspectRatio: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
});

export default GridItem;