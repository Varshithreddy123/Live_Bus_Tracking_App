import React from 'react';
import { View, Text, Image, ImageBackground, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper';
import { styles } from './styles';
import { slides } from '@/configs/constants';
import Images from '@/utils/images';
import { router } from 'expo-router';
import { BackArrow } from '@/utils/icons';
import color from '@/themes/app.colors';


export default function OnBoardingScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Swiper
        activeDotStyle={styles.activeDotStyle}
        removeClippedSubviews={true}
        paginationStyle={styles.paginationStyle}
        loop={false}
      >
        {slides.map((slide: any, index: number) => (
          <View style={styles.slideContainer} key={index}>
            <Image
              style={styles.imageBackground}
              source={slide.image}
            />
            <View style={[styles.imageBgView]} >
              <ImageBackground
                resizeMode="stretch"
                style={styles.img}
                source={Images.bgOnboarding}>
                <Text style={styles.title}>{slide.text}</Text>
                <Text style={styles.description}>{slide.description}</Text>
                <TouchableOpacity
                  style={styles.backArrow}
                  onPress={() => router.push("/(routes)/login")}
                >
                  <BackArrow colors={color.whiteColor} width={30} height={30} />
                </TouchableOpacity>
              </ImageBackground>
            </View>  
          </View>
        ))}
      </Swiper>
    </View>
  );
}