import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '../../app/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../hooks/firebaseConfig';

const ModalButtons = ({ onRemove, onSave, onClose, onSendCat, cat }: 
  { onRemove: (cat: { url: string }) => void; 
    onSave: () => void; 
    onClose: () => void; 
    onSendCat: () => void; 
    cat: { url: string } }) => {

  const authContext = useAuth(); 
  const user = authContext?.user;
  const setUser = authContext?.setUser;

  const handleRemove = async (cat: { url: string }) => {
    if (user && setUser) {
      const updatedCollection = user.collection.filter((c) => c.url !== cat.url);
      const updatedUser = { ...user, catcoins: user.catcoins + 5, collection: updatedCollection };
      setUser(updatedUser);
      if (!auth.currentUser) return;
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userDocRef, {
        catcoins: updatedUser.catcoins,
        collection: updatedUser.collection,
      });
      onRemove(cat);
    }
  };

  return (
    <View style={styles.buttonContainer}>
      <View style={styles.actionButtons}>
        <TouchableOpacity style={[styles.button, styles.removeButton]} onPress={() => handleRemove(cat)}>
          <Text style={styles.buttonText}>Remove Cat</Text>
          <Text style={styles.buttonSmallText}>Refunds 5 Catcoins</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={onSave}>
          <Text style={styles.buttonText}>Save Image</Text>
          <Text style={styles.buttonSmallText}>to Camera Roll</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={onSendCat}>
          <Text style={styles.buttonText}>Send this cat to another user</Text>
          <Text style={styles.buttonSmallText}>Say goodbye to this cat and earn 8 catcoins</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <FontAwesome name="times" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  removeButton: {
    backgroundColor: 'red',
  },
  saveButton: {
    backgroundColor: 'orange',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonSmallText: {
    color: 'white',
    fontSize: 10,
  },
  closeButton: {
    padding: 10,
    backgroundColor: 'grey',
    borderRadius: 50,
  },
});

export default ModalButtons;