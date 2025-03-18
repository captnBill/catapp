import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import SingleSummonButton from '../../components/custom/SingleSummonButton';
import MultiSummonButton from '../../components/custom/MultiSummonButton';
import SummonDisplay from '../../components/custom/SummonDisplay';
import CatShrineTitle from '../../components/custom/CatShrineTitle';
import { ThemedText } from '@/components/ThemedText';
import { useAuth } from '../../app/AuthContext';

const { width } = Dimensions.get('window');

export default function SummonScreen() {
  const [summonedCats, setSummonedCats] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const authContext = useAuth();
  const user = authContext?.user;

  const handleSingleSummon = (cat: any) => {
    setSummonedCats([cat]);
  };

  const handleMultiSummon = (cats: any[]) => {
    setSummonedCats(cats);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CatShrineTitle />
      <ThemedText style={styles.explanation}>
        Add cats to your collection!{'\n\n'}
        A single summon costs 5 Catcoins.{'\n\n'}
        A x10 summon costs 50 Catcoins.
      </ThemedText>
      <ThemedText style={styles.catcoins}>Current Catcoins: {user?.catcoins ?? 0}</ThemedText>
      <View style={styles.buttonContainer}>
        <SingleSummonButton onSummon={handleSingleSummon} />
        <MultiSummonButton onSummon={handleMultiSummon} />
      </View>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      <SummonDisplay cats={summonedCats} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    width: width * 0.9,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  explanation: {
    textAlign: 'center',
    marginVertical: 16,
  },
  catcoins: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonEnabled: {
    backgroundColor: 'orange',
  },
  buttonDisabled: {
    backgroundColor: 'grey',
  },
  buttonTextEnabled: {
    color: 'white',
  },
  buttonTextDisabled: {
    color: 'black',
  },
});