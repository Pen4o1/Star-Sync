import * as React from "react";
import Svg, { Path, Line } from "react-native-svg";
import { useColorScheme } from "../../../../hooks/useColorScheme";
import { Colors } from "../../../../constants/Colors";
const FilterIcon = (props) => {
  const ColorScheme = useColorScheme();
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 28 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M6.12771 9.52816C8.47205 9.52816 10.3823 7.63789 10.3823 5.294C10.3823 2.95012 8.47205 1.05985 6.12771 1.05985C3.78338 1.05985 1.87308 2.95012 1.87308 5.294C1.87308 7.63789 3.78338 9.52816 6.12771 9.52816Z"
        stroke={Colors[ColorScheme ?? "light"].icon}
        strokeWidth={1.86322}
      />
      <Path
        d="M22.0432 18.6258C19.6989 18.6258 17.7886 16.7355 17.7886 14.3917C17.7886 12.0478 19.6989 10.1575 22.0432 10.1575C24.3875 10.1575 26.2978 12.0478 26.2978 14.3917C26.2978 16.7355 24.3875 18.6258 22.0432 18.6258Z"
        stroke={Colors[ColorScheme ?? "light"].icon}
        strokeWidth={1.86322}
      />
      <Line
        x1={17.5009}
        y1={3.94266}
        x2={26.6842}
        y2={3.94266}
        stroke={Colors[ColorScheme ?? "light"].icon}
        strokeWidth={1.86322}
        strokeLinecap="round"
      />
      <Line
        x1={0.931608}
        y1={-0.931608}
        x2={10.1149}
        y2={-0.931608}
        transform="matrix(-1 0 0 1 12.7109 17.2957)"
        stroke={Colors[ColorScheme ?? "light"].icon}
        strokeWidth={1.86322}
        strokeLinecap="round"
      />
    </Svg>
  );
};
export default FilterIcon;
