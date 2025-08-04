import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal as RNModal,
  ScrollView,
} from 'react-native';

const Modal = ({
  visible,
  onClose,
  title,
  children,
  confirmText = '确定',
  cancelText = '取消',
  onConfirm,
  onCancel,
  showButtons = true,
  type = 'default', // default, success, warning, error, info
  size = 'medium', // small, medium, large
  showCloseButton = true,
  closeOnOverlayPress = true,
}) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return { backgroundColor: '#4caf50', icon: '✓' };
      case 'warning':
        return { backgroundColor: '#ff9800', icon: '⚠' };
      case 'error':
        return { backgroundColor: '#f44336', icon: '✕' };
      case 'info':
        return { backgroundColor: '#2196f3', icon: 'ℹ' };
      default:
        return { backgroundColor: '#1976d2', icon: null };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { width: 320, maxWidth: '85%' };
      case 'large':
        return { width: 600, maxWidth: '95%' };
      default:
        return { width: 480, maxWidth: '90%' };
    }
  };

  const typeStyles = getTypeStyles();
  const sizeStyles = getSizeStyles();

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={closeOnOverlayPress ? onClose : undefined}
      >
        <TouchableOpacity
          style={[styles.modalContainer, sizeStyles]}
          activeOpacity={1}
          onPress={() => {}}
        >
          <View style={styles.modalContent}>
            {/* 头部 */}
            <View style={[styles.header, { backgroundColor: typeStyles.backgroundColor }]}>
              {typeStyles.icon && (
                <Text style={styles.typeIcon}>{typeStyles.icon}</Text>
              )}
              <Text style={styles.title}>{title}</Text>
              {showCloseButton && (
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <Text style={styles.closeButtonText}>×</Text>
                </TouchableOpacity>
              )}
            </View>
            
            {/* 内容区域 */}
            <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
              {children}
            </ScrollView>

            {/* 底部按钮 */}
            {showButtons && (
              <View style={styles.footer}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={onCancel || onClose}
                >
                  <Text style={styles.cancelButtonText}>{cancelText}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.confirmButton, { backgroundColor: typeStyles.backgroundColor }]}
                  onPress={onConfirm}
                >
                  <Text style={styles.confirmButtonText}>{confirmText}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
    maxHeight: '80%',
  },
  modalContent: {
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  typeIcon: {
    fontSize: 20,
    color: '#ffffff',
    marginRight: 12,
    fontWeight: 'bold',
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  closeButton: {
    padding: 4,
    marginLeft: 12,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  body: {
    padding: 24,
    maxHeight: 400,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
});

export default Modal; 