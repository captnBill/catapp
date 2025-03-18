import React, { useState } from 'react';
import { View, FlatList, Modal, Image, StyleSheet } from 'react-native';
import { useAuth } from '../../app/AuthContext';
import GridItem from '../../components/custom/GridItem';
import ModalButtons from '../../components/custom/ModalButtons';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';
import { Dimensions } from 'react-native'; // Add this import


const CollectionScreen = () => {
  const router = useRouter();
  const authContext = useAuth();
  if (!authContext) {
    return null; // or handle the null case appropriately
  }
  const { user, setUser } = authContext;
  const [selectedCat, setSelectedCat] = useState<any>(null);
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const calculateImageSize = (width: number, height: number) => {
    const maxWidth = screenWidth * 0.9; // 90% of screen width
    const maxHeight = screenHeight * 0.6; // 60% of screen height
    const aspectRatio = width / height;

    if (width > maxWidth || height > maxHeight) {
      if (width / maxWidth > height / maxHeight) {
        return { width: maxWidth, height: maxWidth / aspectRatio };
      } else {
        return { width: maxHeight * aspectRatio, height: maxHeight };
      }
    }
    return { width, height };
  };

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
      try {
        const fileUri = FileSystem.documentDirectory + cat.url.split('/').pop();
        const downloadResumable = FileSystem.createDownloadResumable(
          cat.url,
          fileUri
        );
        const downloadResult = await downloadResumable.downloadAsync();
        if (downloadResult && downloadResult.uri) {
          await MediaLibrary.createAssetAsync(downloadResult.uri);
          alert('Image saved to camera roll!');
        } else {
          alert('Failed to download image.');
        }
      } catch (error) {
        if (error instanceof Error) {
          alert('Failed to save image: ' + error.message);
        } else {
          alert('Failed to save image.');
        }
      }
    } else {
      alert('Permission to access camera roll is required!');
    }
  };

  const handleSendCat = (cat: any) => {
    // redirect to SendCatScreen with the selected cat in route params
    router.push({ pathname: '../SendCatScreen', params: cat });

    setSelectedCat(null);
  };

  const renderItem = ({ item }: { item: any }) => (
    <GridItem item={item} onPress={() => setSelectedCat(item)} />
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
              <Image source={{ uri: selectedCat.url }} 
              style={[
                styles.fullImage,
                calculateImageSize(selectedCat.width, selectedCat.height),
              ]} />
              <ModalButtons
                cat={selectedCat}
                onRemove={() => handleRemoveCat(selectedCat)}
                onSave={() => handleSaveImage(selectedCat)}
                onClose={() => setSelectedCat(null)}
                onSendCat={() => handleSendCat(selectedCat)}
              />
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  fullImage: {

    marginBottom: 20,
  },
});

export default CollectionScreen;