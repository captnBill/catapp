import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const ModalButtons = ({ onRemove, onSave, onClose }: { onRemove: () => void; onSave: () => void; onClose: () => void }) => (
  <View style={styles.buttonContainer}>
    <View style={styles.actionButtons}>
      <TouchableOpacity style={[styles.button, styles.removeButton]} onPress={onRemove}>
        <Text style={styles.buttonText}>Remove Cat</Text>
        <Text style={styles.buttonSmallText}>Refunds 5 Catcoins</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={onSave}>
        <Text style={styles.buttonText}>Save Image</Text>
        <Text style={styles.buttonSmallText}>to Camera Roll</Text>
      </TouchableOpacity>
    </View>
    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
      <FontAwesome name="times" size={24} color="white" />
    </TouchableOpacity>
  </View>
);

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