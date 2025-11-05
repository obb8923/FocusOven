import { View, Button } from 'react-native';
import { Text } from '@component/Text';
import { useSetFirstVisitMarkVisited } from '@store/firstVisitStore';
import { useSetTab } from '@store/tabStore';
import {Background} from '@component/Background';
export const OnboardingScreen = () => {
  const markVisited = useSetFirstVisitMarkVisited();
  const setTab = useSetTab();

  const handleComplete = async () => {
    await markVisited();
    setTab('AppMain');
  };
  return (
    <Background>
      <Button title="온보딩 완료" onPress={handleComplete} />
    </Background>
  );
};