import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { useColorScheme } from "../../../../hooks/useColorScheme";
import { Colors } from "../../../../constants/Colors";
const TabProfile = (props) => {
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
        d="M11.875 14.8326C16.1451 14.8326 19.75 15.5722 19.75 18.4286C19.75 21.285 16.122 22 11.875 22C7.60486 22 4 21.2593 4 18.404C4 15.5475 7.62694 14.8326 11.875 14.8326ZM11.875 1C14.7673 1 17.0858 3.47206 17.0858 6.55598C17.0858 9.6399 14.7673 12.112 11.875 12.112C8.9827 12.112 6.66424 9.6399 6.66424 6.55598C6.66424 3.47206 8.9827 1 11.875 1Z"
        fill={Colors[ColorScheme ?? "light"].icon}
      />
    </Svg>
  );
};
export default TabProfile;
