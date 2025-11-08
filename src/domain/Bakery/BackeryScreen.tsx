import {useMemo, useState} from 'react';
import {Image, Modal, ScrollView, TouchableOpacity, View} from 'react-native';
import { Text } from '@shared/component/Text';
import { Background } from '@shared/component/Background';
import MenuIcon from '@assets/svgs/Menu.svg';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { AppMainDrawerParamList } from '@/shared/nav/drawer/AppMainDrawer';
import { BREADS, Bread } from '@shared/constant/breads';
import { useGetBakerLevel, useGetBreadCounts, useGetFocusLogs } from '@store/bakerStore';

type BreadSection = {
  title: string;
  level: Bread['level'];
  data: Bread[];
};

export const BakeryScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<AppMainDrawerParamList>>();
  const level = useGetBakerLevel();
  const breadCounts = useGetBreadCounts();
  const focusLogs = useGetFocusLogs();
  const [selectedBread, setSelectedBread] = useState<Bread | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const lastLog = selectedBread ? focusLogs.find((log) => log.breadKey === selectedBread.key) : undefined;
  const lastObtained = lastLog ? new Date(lastLog.finishedAt).toLocaleString() : null;
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

        {breadSections.map((section, index) => (
          <View key={section.level} className="mt-10">
            <View className="mb-4 flex-row items-center">
              <Text text={section.title} type="title3" className="text-gray-900 mr-3" />
              <View className="h-px flex-1 bg-gray-300" />
            </View>
            <View className="-mx-1 flex-row flex-wrap">
              {section.data.map(bread => {
                const count = breadCounts[bread.key] ?? 0;
                return (
                  <TouchableOpacity
                    key={bread.key}
                    className="w-1/4 px-1 mb-3"
                    onPress={() => {
                      setSelectedBread(bread);
                      setModalVisible(true);
                    }}
                    activeOpacity={0.85}
                  >
                    <View className="bg-white rounded-2xl p-3 items-center shadow-sm shadow-black/5 relative overflow-hidden">
                      <Image
                        source={bread.source}
                        className="w-16 h-16 rounded-xl mb-2"
                        resizeMode="cover"
                        style={{ opacity: count > 0 ? 1 : 0.3 }}
                      />
                      <Text text={bread.koName} type="body2" className="text-gray-900 text-center" numberOfLines={1} />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal
        visible={modalVisible && selectedBread != null}
        animationType="fade"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        {selectedBread && (
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white rounded-3xl p-6 w-full max-w-sm gap-y-4">
            <Text text={selectedBread?.koName ?? ''} type="title2" className="text-center" />
            <Image
              source={selectedBread?.source ?? undefined}
              className="w-32 h-32 self-center"
              resizeMode="contain"
            />
            <Text
              text={`필요 레벨: ${selectedBread?.level ?? '-'}`}
              type="body2"
              className="text-center text-gray-500"
            />
            <Text
              text={`보유 개수: ${selectedBread ? breadCounts[selectedBread.key] ?? 0 : 0}개`}
              type="body1"
              className="text-center font-semibold"
            />
            {lastObtained ? (
              <Text
                text={`마지막 획득: ${lastObtained}`}
                type="body2"
                className="text-center text-gray-600"
              />
            ) : (
              <Text text="아직 획득하지 않았어요." type="body2" className="text-center text-gray-600" />
            )}
            <Text text={selectedBread?.description ?? ''} type="body2" className="text-gray-700 text-center" />
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="mt-2 rounded-full bg-blue-500 py-3 items-center"
              activeOpacity={0.85}
            >
              <Text text="확인" type="body2" className="text-white font-semibold" />
            </TouchableOpacity>
          </View>
        </View>
        )}
      </Modal>
    </Background>
  );
};