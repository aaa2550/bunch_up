import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import { getTools, getToolDetail } from '../api/toolAPI';

const ToolBar = () => {
  const [tools, setTools] = useState([]);
  const [selectedTool, setSelectedTool] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({});
  const currentCategory = useSelector(state => state.category.currentCategory);

  useEffect(() => {
    loadTools();
  }, [currentCategory]);

  const loadTools = async () => {
    try {
      const toolsData = await getTools(currentCategory?.id);
      setTools(toolsData);
    } catch (error) {
      console.error('Failed to load tools:', error);
    }
  };

  const handleToolClick = async (tool) => {
    try {
      const toolDetail = await getToolDetail(tool.id);
      setSelectedTool(toolDetail);
      setFormData({});
      setModalVisible(true);
    } catch (error) {
      console.error('Failed to load tool detail:', error);
    }
  };

  const renderFormField = (field) => {
    switch (field.fieldType) {
      case 'input':
        return (
          <TextInput
            style={styles.input}
            placeholder={field.placeholder}
            maxLength={field.maxLength}
            value={formData[field.fieldName]}
            onChangeText={(text) => setFormData({ ...formData, [field.fieldName]: text })}
          />
        );
      case 'textarea':
        return (
          <TextInput
            style={styles.textarea}
            placeholder={field.placeholder}
            multiline
            maxLength={field.maxLength}
            value={formData[field.fieldName]}
            onChangeText={(text) => setFormData({ ...formData, [field.fieldName]: text })}
          />
        );
      case 'radio':
        return (
          <View style={styles.radioGroup}>
            {field.options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={styles.radioOption}
                onPress={() => setFormData({ ...formData, [field.fieldName]: option.value })}
              >
                <View 
                  style={[
                    styles.radioButton,
                    formData[field.fieldName] === option.value && styles.radioButtonSelected
                  ]}
                />
                <Text style={styles.radioLabel}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.toolBar}>
        {tools.map((tool) => (
          <TouchableOpacity
            key={tool.id}
            style={styles.toolButton}
            onPress={() => handleToolClick(tool)}
          >
            <Icon name={tool.icon} size={24} color="#1976D2" />
            <Text style={styles.toolName}>{tool.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedTool?.name}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.formContainer}>
              {selectedTool?.formFields.map((field, index) => (
                <View key={index} style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>
                    {field.fieldLabel}
                    {field.required && <Text style={styles.required}>*</Text>}
                  </Text>
                  {renderFormField(field)}
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.submitButton}>
              <Text style={styles.submitButtonText}>提交</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 60,
    backgroundColor: '#fff',
    borderLeftWidth: 1,
    borderLeftColor: '#eee',
  },
  toolBar: {
    padding: 10,
  },
  toolButton: {
    alignItems: 'center',
    marginVertical: 10,
  },
  toolName: {
    fontSize: 12,
    marginTop: 4,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    maxWidth: 400,
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  formContainer: {
    maxHeight: '70%',
  },
  fieldContainer: {
    marginBottom: 15,
  },
  fieldLabel: {
    fontSize: 14,
    marginBottom: 5,
    color: '#333',
  },
  required: {
    color: '#f44336',
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    fontSize: 14,
  },
  textarea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    fontSize: 14,
    height: 100,
    textAlignVertical: 'top',
  },
  radioGroup: {
    marginTop: 5,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#1976D2',
    marginRight: 8,
  },
  radioButtonSelected: {
    backgroundColor: '#1976D2',
  },
  radioLabel: {
    fontSize: 14,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#1976D2',
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ToolBar;
