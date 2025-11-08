import { ScrollView, View } from 'react-native';
import { Text } from '@shared/component/Text';
import { Background } from '@shared/component/Background';
import { TouchableOpacity } from 'react-native';
import MenuIcon from '@assets/svgs/Menu.svg';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { AppMainDrawerParamList } from '@/shared/nav/drawer/AppMainDrawer';

const QUICK_LINKS = [
  {
    title: '📦 주문/배송',
    description: '배송 현황을 확인하고 문제를 바로 접수하세요.',
    actionLabel: '배송 조회',
  },
  {
    title: '📞 고객 지원',
    description: '궁금한 점은 1:1 문의 또는 전화 상담으로 해결하세요.',
    actionLabel: '문의하기',
  },
  {
    title: '📝 공지사항',
    description: '이벤트와 업데이트 소식을 빠르게 확인해보세요.',
    actionLabel: '공지 보기',
  },
];

const HELP_GUIDES = [
  {
    title: '오븐 사용 가이드',
    description: '처음이라면 이 가이드를 통해 핵심 기능을 익혀보세요.',
  },
  {
    title: '자주 묻는 질문',
    description: '다른 사용자들이 가장 많이 찾는 질문을 모아뒀어요.',
  },
  {
    title: '고장 신고 방법',
    description: '문제가 생겼을 때 빠르게 조치하는 방법을 안내해드려요.',
  },
];

export const ETCScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<AppMainDrawerParamList>>();
  return (
    <Background>
      <View className="px-4 flex-row my-6 w-full items-center justify-between">
        <TouchableOpacity className="p-3 bg-gray-100 rounded-full" onPress={() => navigation.openDrawer()}>
          <MenuIcon width={18} height={18} color="#666666"/>
        </TouchableOpacity>
        <Text text="ETC" type="title1" className="text-2xl" />
        <View className="p-3 rounded-full" />
      </View>

      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 40, gap: 24 }}>
        <View className="gap-y-4 bg-gray-100 rounded-3xl px-4 py-6">
          <Text text="빠른 메뉴" type="title1" className="text-xl font-semibold" />
          <View className="gap-y-3">
            {QUICK_LINKS.map((link) => (
              <TouchableOpacity
                key={link.title}
                className="rounded-2xl bg-white px-4 py-4 border border-gray-200"
                activeOpacity={0.85}
                onPress={() => {}}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1 gap-y-1">
                    <Text text={link.title} type="title3" className="text-base font-semibold" />
                    <Text text={link.description} type="body2" className="text-sm text-gray-500" />
                  </View>
                  <Text text={link.actionLabel} type="body2" className="text-primary font-semibold" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="gap-y-4 bg-gray-100 rounded-3xl px-4 py-6">
          <Text text="도움말" type="title1" className="text-xl font-semibold" />
          <View className="gap-y-3">
            {HELP_GUIDES.map((guide) => (
              <View key={guide.title} className="rounded-2xl bg-white px-4 py-4 border border-gray-200">
                <Text text={guide.title} type="title3" className="text-base font-semibold mb-1" />
                <Text text={guide.description} type="body2" className="text-sm text-gray-500" />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </Background>
  );
};