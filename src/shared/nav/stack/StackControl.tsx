import {AppMainDrawer} from "@/shared/nav/drawer/AppMainDrawer";
import {BackeryStack} from "@nav/stack/BackeryStack";
import {ETCStack} from "@nav/stack/ETCStack";
import {OnboardingStack} from "@nav/stack/OnboardingStack";
import { useGetCurrentTab } from "@store/tabStore";


export function StackControl() {
  const currentTab = useGetCurrentTab();
  if (currentTab === "AppMain") return (<AppMainDrawer />);
  if (currentTab === "Backery") return (<BackeryStack />);
  if (currentTab === "ETC") return (<ETCStack />);
  return (<OnboardingStack />);
}
  