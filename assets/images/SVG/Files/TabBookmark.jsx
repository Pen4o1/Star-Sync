import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { useColorScheme } from "../../../../hooks/useColorScheme";
import { Colors } from "../../../../constants/Colors";
const TabBookmark = (props) => {
  const ColorScheme = useColorScheme();

  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M16.191 2C19.28 2 21 3.78 21 6.83V17.16C21 20.26 19.28 22 16.191 22H7.81C4.77 22 3 20.26 3 17.16V6.83C3 3.78 4.77 2 7.81 2H16.191ZM8.08 15.74C7.78 15.71 7.49 15.85 7.33 16.11C7.17 16.36 7.17 16.69 7.33 16.95C7.49 17.2 7.78 17.35 8.08 17.31H15.92C16.319 17.27 16.62 16.929 16.62 16.53C16.62 16.12 16.319 15.78 15.92 15.74H8.08ZM15.92 11.179H8.08C7.649 11.179 7.3 11.53 7.3 11.96C7.3 12.39 7.649 12.74 8.08 12.74H15.92C16.35 12.74 16.7 12.39 16.7 11.96C16.7 11.53 16.35 11.179 15.92 11.179ZM11.069 6.65H8.08V6.66C7.649 6.66 7.3 7.01 7.3 7.44C7.3 7.87 7.649 8.22 8.08 8.22H11.069C11.5 8.22 11.85 7.87 11.85 7.429C11.85 7 11.5 6.65 11.069 6.65Z"
        fill={Colors[ColorScheme ?? "light"].icon}
      />
    </Svg>
  );
};
export default TabBookmark;
