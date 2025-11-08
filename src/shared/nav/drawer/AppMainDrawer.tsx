import { AppMainScreen } from "@domain/AppMain/AppMainScreen";
import { BakeryScreen } from "@domain/Bakery/BackeryScreen";
import { ETCScreen } from "@domain/ETC/ETCScreen";
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ChevronRightIcon from "@assets/svgs/ChevronRight.svg";
export type AppMainDrawerParamList = {
  AppMainHome: undefined;
  Backery: undefined;
  ETC: undefined;
};

const Drawer = createDrawerNavigator<AppMainDrawerParamList>();

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const insets = useSafeAreaInsets();
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ paddingTop: insets.top }}
    >
      <View className="w-full items-end justify-center ">
      <TouchableOpacity className="p-3 bg-gray-100 rounded-full mb-4" style={{transform: [{rotate: '180deg'}]}} onPress={() => props.navigation.closeDrawer()} activeOpacity={0.8}>
        <ChevronRightIcon width={18} height={18} color="#666666" />
      </TouchableOpacity>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

export const AppMainDrawer = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerType: "slide",
      }}
      initialRouteName="AppMainHome"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="AppMainHome"
        component={AppMainScreen}
        options={{
          title: "AppMain",
        }}
      />
      <Drawer.Screen
        name="Backery"
        component={BakeryScreen}
        options={{
          title: "Breads",
        }}
      />
      <Drawer.Screen
        name="ETC"
        component={ETCScreen}
        options={{
          title: "ETC",
        }}
      />
    </Drawer.Navigator>
  );
};