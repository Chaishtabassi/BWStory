import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CharacterCounterProps {
  text: string;
  maxWords: number;
}

const CharacterCounter: React.FC<CharacterCounterProps> = ({ text, maxWords }) => {
  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const isOverLimit = wordCount > maxWords;
  const remaining = maxWords - wordCount;

  return (
    <View style={styles.container}>
      <Text style={[styles.counter, isOverLimit && styles.overLimit]}>
        {wordCount}/{maxWords} words
      </Text>
      {isOverLimit && (
        <Text style={styles.warning}>
          ⚠️ Exceeded by {Math.abs(remaining)} words
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    marginTop: 4,
  },
  counter: {
    fontSize: 12,
    color: '#999',
  },
  overLimit: {
    color: '#f44336',
    fontWeight: 'bold',
  },
  warning: {
    fontSize: 11,
    color: '#f44336',
    marginTop: 2,
  },
});

export default CharacterCounter;