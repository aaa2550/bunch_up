import React from 'react';
import {Text} from 'react-native';

// Material Icons的Unicode字符映射
const iconMap = {
  'chat': '\ue0b7',
  'category': '\ue14f',
  'build': '\ue869',
  'person': '\ue7fd',
  'arrow-back': '\ue5c4',
  'more-vert': '\ue5d4',
  'send': '\ue163',
  'edit': '\ue3c9',
  'people': '\ue7fb',
  'group': '\ue7ef',
  'chevron-right': '\ue5cc',
  'smart-toy': '\uea2a',
  'notifications': '\ue7f4',
  'security': '\ue32a',
  'info': '\ue88e',
  'logout': '\ue9ba',
};

const WebIcon = ({name, size = 24, color = '#000', style}) => {
  const iconChar = iconMap[name] || '\ue88e'; // 默认使用info图标

  return (
    <Text
      style={[
        {
          fontFamily: 'Material Icons',
          fontSize: size,
          color: color,
          lineHeight: size,
        },
        style,
      ]}>
      {iconChar}
    </Text>
  );
};

export default WebIcon; 