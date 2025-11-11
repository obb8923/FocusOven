import { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, TouchableOpacity, View } from 'react-native';
import { Text } from '@shared/component/Text';
import { Background } from '@shared/component/Background';
import MenuIcon from '@assets/svgs/Menu.svg';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppMainDrawerParamList } from '@/shared/nav/drawer/AppMainDrawer';
import { useSetSettingsLoad } from '@store/settingsStore';
import { ETCStackParamList } from '@nav/stack/ETCStack';
import { useTranslation } from "react-i18next";
import { changeLanguage, getCurrentLanguage, supportedLanguages, type SupportedLanguage } from '@lib/i18n';

type NavigationProp = CompositeNavigationProp<
  DrawerNavigationProp<AppMainDrawerParamList>,
  NativeStackNavigationProp<ETCStackParamList>
>;

export const ETCScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const loadSettings = useSetSettingsLoad();
  const [languageChanging, setLanguageChanging] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    loadSettings().catch((error) => {
      if (__DEV__) {
        console.error('[ETCScreen] Failed to load settings', error);
      }
    });
  }, [loadSettings]);

  const currentLanguage = getCurrentLanguage();

  const languageOptions = useMemo(
    () =>
      supportedLanguages.map((language) => ({
        value: language,
        label: t(`settings.language.options.${language}`),
      })),
    [t],
  );

 

 

  const handleLanguageSelect = async (language: SupportedLanguage) => {
    if (language === currentLanguage) {
      return;
    }
    try {
      setLanguageChanging(true);
      await changeLanguage(language);
      Alert.alert(t('settings.language.success'));
    } catch (error) {
      if (__DEV__) {
        console.error('[ETCScreen] Failed to change language', error);
      }
      Alert.alert(t('settings.language.error'));
    } finally {
      setLanguageChanging(false);
    }
  };

  return (
    <Background>

      <View className="px-4 flex-row my-6 w-full items-center justify-between">
        <TouchableOpacity className="p-3 bg-gray-100 rounded-full" onPress={() => navigation.openDrawer()}>
          <MenuIcon width={18} height={18} stroke="#666666" />
        </TouchableOpacity>
        <Text text={t('navigation.drawer.settings')} type="title1" className="text-2xl" />
        <View className="p-3 rounded-full" />
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 48, gap: 24 }}>
        <View className=" bg-gray-200 px-8 py-6 gap-y-2">
              <Text text={t('settings.language.title')} type="title3" className="text-base font-semibold" />
              <Text text={t('settings.language.description')} type="body2" className="text-sm text-gray-500" />
              <View className="flex-row gap-x-2">
                {languageOptions.map(({ value, label }) => {
                  const selected = value === currentLanguage;
                  return (
                    <TouchableOpacity
                      key={value}
                      disabled={selected || languageChanging}
                      onPress={() => handleLanguageSelect(value)}
                      className={`flex-1 px-3 py-3 rounded-xl border ${
                        selected ? 'bg-[#E1ECFE] border-primary/30' : 'bg-white border-gray-200'
                      }`}
                      activeOpacity={0.85}
                    >
                      <Text
                        text={label}
                        type="body2"
                        className={selected ? 'text-primary font-semibold text-center' : 'text-gray-500 text-center'}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
        </View>
      </ScrollView>
    </Background>
  );
};