import { useMemo, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { useTranslation } from "react-i18next";
import { Text } from '@shared/component/Text';
import { Background } from '@shared/component/Background';
import MenuIcon from '@assets/svgs/Menu.svg';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { AppMainDrawerParamList } from '@/shared/nav/drawer/AppMainDrawer';
import { BREADS, Bread } from '@shared/constant/breads';
import { useGetBreadCounts, useGetFocusLogs } from '@store/bakerStore';
import { BreadImage } from '@component/BreadImage';
import { BreadDetailModal } from './component/BreadDetailModal';

const toDisplayLevel = (level: Bread["level"]): number => Math.max(0, level - 1);

export const BakeryScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<AppMainDrawerParamList>>();
  const { t, i18n } = useTranslation();
  const breadCounts = useGetBreadCounts();
  const focusLogs = useGetFocusLogs();
  const [selectedBread, setSelectedBread] = useState<Bread | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const breads = useMemo<Bread[]>(() => {
    return [...BREADS].sort((a, b) => {
      if (a.level === b.level) {
        const aName = t(`bread.${a.key}.name`);
        const bName = t(`bread.${b.key}.name`);
        return aName.localeCompare(bName, i18n.language);
      }
      return a.level - b.level;
    });
  }, [i18n.language, t]);

  const selectedBreadOwnedCount = selectedBread ? breadCounts[selectedBread.key] ?? 0 : 0;
  const selectedBreadLastObtained = selectedBread
    ? (() => {
        const log = focusLogs.find((item) => item.breadKey === selectedBread.key);
        return log ? new Date(log.finishedAt).toLocaleString() : null;
      })()
    : null;
  const selectedBreadDisplayLevel = selectedBread ? toDisplayLevel(selectedBread.level) : null;

  return (
    <Background>
      <ScrollView
        contentContainerStyle={{paddingHorizontal: 16, paddingBottom: 32}}
        showsVerticalScrollIndicator={false}>
        <View className="flex-row my-6 w-full items-center justify-between">
          <TouchableOpacity className="p-3 bg-gray-100 rounded-full" onPress={() => navigation.openDrawer()}>
            <MenuIcon width={18} height={18} color="#666666"/>
          </TouchableOpacity>
          <Text text={t("bakery.title")} type="title1" className="text-2xl" />
          <View className="p-3 rounded-full" />
        </View>

        <View className="-mx-1 flex-row flex-wrap">
          {breads.map((bread) => {
            const count = breadCounts[bread.key] ?? 0;
            const locked = count === 0;
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
                <View className="bg-white rounded-2xl p-3 items-center shadow-sm shadow-black/5 relative overflow-hidden gap-y-2">
                  <View className="w-16" style={{ aspectRatio: 1 }}>
                    <BreadImage
                      source={bread.source}
                      selected={false}
                      locked={locked}
                      lockedLabel={locked ? t("bakery.noneOwnedLabel") : undefined}
                    />
                  </View>
                  <Text
                    text={t(`bread.${bread.key}.name`)}
                    type="body2"
                    className="text-gray-900 text-center"
                    numberOfLines={1}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <BreadDetailModal
        visible={modalVisible && selectedBread != null}
        bread={selectedBread}
        ownedCount={selectedBreadOwnedCount}
        lastObtained={selectedBreadLastObtained}
        displayLevel={selectedBreadDisplayLevel}
        onRequestClose={() => setModalVisible(false)}
      />
    </Background>
  );
};