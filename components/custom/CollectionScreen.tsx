import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Modal, Button } from 'react-native';
import { useAuth } from '../../app/AuthContext';
import * as MediaLibrary from 'expo-media-library';

const CollectionScreen = () => {
  const { user, setUser } = useAuth() || {};
  const [selectedCat, setSelectedCat] = useState<any>(null);

  const handleRemoveCat = (cat: any) => {
    if (user && setUser) {
      const updatedCollection = user.collection.filter((c) => c.url !== cat.url);
      const updatedUser = { ...user, catcoins: user.catcoins + 5, collection: updatedCollection };
      setUser(updatedUser);
      setSelectedCat(null);
    }
  };

  const handleSaveImage = async (cat: any) => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === 'granted') {
      await MediaLibrary.createAssetAsync(cat.url);
      alert('Image saved to camera roll!');
    } else {
      alert('Permission to access camera roll is required!');
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => setSelectedCat(item)} style={styles.gridItem}>
      <Image source={{ uri: item.url }} style={styles.image} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={user?.collection}
        renderItem={renderItem}
        keyExtractor={(item) => item.url}
        numColumns={3}
        contentContainerStyle={styles.grid}
      />
      <Modal visible={!!selectedCat} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          {selectedCat && (
            <>
              <Image source={{ uri: selectedCat.url }} style={styles.fullImage} />
              <Button title="Remove Cat" onPress={() => handleRemoveCat(selectedCat)} />
              <Button title="Save Image" onPress={() => handleSaveImage(selectedCat)} />
              <Button title="Close" onPress={() => setSelectedCat(null)} />
            </>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  grid: {
    justifyContent: 'center',
  },
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  fullImage: {
    width: '80%',
    height: '50%',
    marginBottom: 20,
  },
});

export default CollectionScreen;