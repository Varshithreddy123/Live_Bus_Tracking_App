import { View, Text, Image } from 'react-native';
import React, { ReactNode } from 'react';
import { external } from '@/styles/external.style';
import Images from '@/utils/images';
import { windowWidth } from '@/themes/app.constant';
import { styles } from '@/utils/container/styles';
import { ScrollView } from 'react-native';
import { processFontFamily } from 'expo-font';

type Props = {
  container: ReactNode;
  topSpace?: number;
  imageShow?: boolean;
  backgroundColor?: string;
  title?: string;
};

const AuthContainer = ({
  container,
  topSpace = 0,
  imageShow = true,
  backgroundColor = "#fff",
  title = "Track Us",
}: Props) => {
  return (
    <View style={[external.fx_1, { backgroundColor }]}>
      {imageShow && (
        <Text
          style={[
            styles.titleText,
            { marginTop: windowWidth(topSpace) },
          ]}
        >
          {title}
        </Text>
      )}
      <Image
        style={[styles.backgroundImage, { marginTop: topSpace }]}
        source={Images.authBg}
        resizeMode="cover"
      />
      <View style={styles.containerContent}>
        <View style={[styles.container]}>
          <ScrollView>{container}</ScrollView>
        </View>
      </View>
    </View>
  );
};

export default AuthContainer;
