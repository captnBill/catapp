import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Text, TextInput, FlatList, TouchableOpacity, Button, useWindowDimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@react-navigation/native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { useRouter } from 'expo-router';


const SendCatScreen = () => {
  const cat = useLocalSearchParams();
  const router = useRouter();
  const authContext = useAuth();
  if (!authContext) {
    return null; // or handle the null case appropriately
  }
  const { user, setUser } = authContext;
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const handleSend = async () => {
    if (!user || !selectedUser) return;

    try {
      // Remove the cat from the current user's collection
      if (user && setUser) {
        const updatedCollection = user.collection.filter((c) => c.url !== cat.url);
        const updatedUser = { ...user, catcoins: user.catcoins + 8, collection: updatedCollection };
        setUser(updatedUser);

        if (!auth.currentUser) return;
          const userDocRef = doc(db, 'users', auth.currentUser.uid); 
          await updateDoc(userDocRef, {
              catcoins: updatedUser.catcoins,
              collection: updatedUser.collection,
           });
      }
  
      // Add the cat to the selected user's collection
      if (selectedUser) {
        const selectedUserCollection = selectedUser.collection;
        const updatedSelectedUserCollection = [...selectedUserCollection, cat];
        const updatedSelectedUser = { ...selectedUser, collection: updatedSelectedUserCollection };
        setSelectedUser(updatedSelectedUser); 

        // find the user doc ref by username
        const userRefs = collection(db, 'users');
        const q = query(userRefs, where('username', '==', selectedUser.username));
        const querySnapshot = await getDocs(q);
        const selectedUserDocRef = querySnapshot.docs[0].ref;
        await updateDoc(selectedUserDocRef, {
          collection: updatedSelectedUserCollection,
        });
      }
  
      // Redirect back to the collection screen
      router.back();
    } catch (error) {
      console.error('Error handling send:', error);
    }
  };

  // Fetch all users except the current user
  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) return;

      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '!=', user.username));
      const querySnapshot = await getDocs(q);

      const fetchedUsers = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setUsers(fetchedUsers);
      setFilteredUsers(fetchedUsers);
    };

    fetchUsers();
  }, [user]);

  // Filter users based on the search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(
        users.filter((user) =>
          user.username.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, users]);

  const handleUserSelect = (user: any) => {
    setSelectedUser(user);
  };

  return (
    <View style={styles.container}>
      {/* Header with cat image and text */}
      <View style={styles.header}>
        <Image
          source={{ uri: Array.isArray(cat.url) ? cat.url[0] : cat.url }}
          style={styles.catImage}
        />
        <ThemedText style={styles.headerText}>Send this cat to another user</ThemedText>
      </View>

      {/* Search box */}
      <TextInput
        style={[styles.input, { borderColor: colors.border, color: colors.text, width: width * 0.95 }]}
        placeholderTextColor={colors.text}
        placeholder="Search for a user..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* User list */}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleUserSelect(item)}
            style={[
              styles.userItem,
              selectedUser?.username === item.username && styles.selectedUserItem,
            ]}
          >
            <ThemedText style={styles.userText}>{item.username}</ThemedText>
          </TouchableOpacity>
        )}
      />

      {/* Goodbye button */}
      <TouchableOpacity
        onPress={handleSend}
        disabled={!selectedUser}
        style={[styles.button, !selectedUser ? styles.buttonDisabled : styles.buttonEnabled]} >
       
       <Text style={styles.buttonText}>Goodbye!</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  input: {
    padding: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  catImage: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchBox: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  userItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  selectedUserItem: {
    backgroundColor: 'orange',
  },
  userText: {
    fontSize: 16,
  },
  button: {
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
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
});

export default SendCatScreen;