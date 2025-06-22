import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native'

const DreamInterpretationModal = ({ visible, dreamWord, onClose }) => {
  const formatDescription = (description) => {
    // Remove HTML tags and format the text
    return description
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/\n\n/g, '\n') // Clean up double line breaks
      .trim()
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {dreamWord?.word} - Dream Interpretation
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalScrollView}>
            <Text style={styles.modalDescription}>
              {dreamWord ? formatDescription(dreamWord.description) : ''}
            </Text>
          </ScrollView>
          
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={onClose}
          >
            <Text style={styles.modalCloseButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  modalTitle: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    color: '#666',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalScrollView: {
    maxHeight: 400,
  },
  modalDescription: {
    color: '#333',
    fontSize: 16,
    lineHeight: 24,
  },
  modalCloseButton: {
    backgroundColor: '#FFAA1E',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  modalCloseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
})

export default DreamInterpretationModal 