/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#000",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    inputBg: "#F1F1F1",
    astroCardBG: "#F1F1F1",
    buttonBg: "#7728DC",
    buttonText: "#fff",
    readmoreText: "#7728DC",
    priceText: "#FFAA1E",
  },
  dark: {
    text: "#ECEDEE",
    background: "#0D114E",
    tint: tintColorDark,
    icon: "#fff",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    astroCardBG: [
      "rgba(179, 121, 223, 0.2)",
      "rgba(204, 84, 199, 0.006)",
      "rgba(179, 121, 223, 0.2)",
    ],
    buttonBg: "#FFAA1E",
    buttonText: "#000",
    readmoreText: "#FFAA1E",
    priceText: "#23FF1E",
  },
};
