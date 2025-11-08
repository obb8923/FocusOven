import {useMemo} from 'react';
import {Image, ScrollView, View} from 'react-native';
import { Text } from '@shared/component/Text';
import { Background } from '@shared/component/Background';
import { TouchableOpacity } from 'react-native';
import MenuIcon from '@assets/svgs/Menu.svg';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { AppMainDrawerParamList } from '@/shared/nav/drawer/AppMainDrawer';
import { BREADS, Bread } from '@shared/constant/breads';

type BreadSection = {
  title: string;
  level: Bread['level'];
  data: Bread[];
};

export const BakeryScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<AppMainDrawerParamList>>();
  const breadSections = useMemo<BreadSection[]>(() => {
    const levels: Bread['level'][] = [1, 2, 3];
    return levels
      .map(level => ({
        title: `레벨 ${level}`,
        level,
        data: BREADS.filter(bread => bread.level === level),
      }))
      .filter(section => section.data.length > 0);
  }, []);

  return (
    <Background>
      <ScrollView
        contentContainerStyle={{paddingHorizontal: 16, paddingBottom: 32}}
        showsVerticalScrollIndicator={false}>
        <View className="flex-row my-6 w-full items-center justify-between">
          <TouchableOpacity className="p-3 bg-gray-100 rounded-full" onPress={() => navigation.openDrawer()}>
            <MenuIcon width={18} height={18} color="#666666"/>
          </TouchableOpacity>
          <Text text="Breads" type="title1" className="text-2xl" />
          <View className="p-3 rounded-full" />
        </View>

        {breadSections.map(section => (
          <View key={section.level} className="mt-8 bg-gray-100 rounded-3xl px-3 py-4">
            <Text text={section.title} type="title3" className="text-gray-900 mb-4" />
            <View className="-mx-1 flex-row flex-wrap">
              {section.data.map(bread => (
                <View key={bread.key} className="w-1/4 px-1 mb-3">
                  <View className="bg-white rounded-2xl p-3 items-center shadow-sm shadow-black/5">
                    <Image source={bread.source} className="w-16 h-16 rounded-xl mb-2" resizeMode="cover" />
                    <Text text={bread.koName} type="body2" className="text-gray-900 text-center" numberOfLines={1} />
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </Background>
  );
};