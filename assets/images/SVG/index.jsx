import React from "react";
import Blog1 from "./Blog/Blog1.svg";
import Home from "./Home.svg";
import Logo from "./Logo.svg";
import AriesImg from "./AriesImg.svg";
import VerifiedIcon from "./VerifyIcon.svg";

import VedicAstrology from "./Services/VedicAstrology.svg";
import TarotReading from "./Services/TarotReading.svg";
import Numerology from "./Services/Numerology.svg";
import PsychicReading from "./Services/PsychicReading.svg";
import Relationship from "./Services/Relationship.svg";
import CareerJob from "./Services/CareerJob.svg";
import MenuIcon from "./Astrologer/MenuIcon.svg";
import Astrologer1 from "./Astrologer/Astrologer1.svg";

const SVGIcons = {
  Blog1: (props) => <Blog1 {...props} />,
  Home: (props) => <Home {...props} />,
  Logo: (props) => <Logo {...props} />,
  AriesImg: (props) => <AriesImg {...props} />,
  VerifiedIcon: (props) => <VerifiedIcon {...props} />,
};

const SVGAstrologer = {
  Astrologer1: (props) => <Astrologer1 {...props} />,
  MenuIcon: (props) => <MenuIcon {...props} />,
};

const SVGServices = {
  VedicAstrology: (props) => <VedicAstrology {...props} />,
  TarotReading: (props) => <TarotReading {...props} />,
  Numerology: (props) => <Numerology {...props} />,
  PsychicReading: (props) => <PsychicReading {...props} />,
  Relationship: (props) => <Relationship {...props} />,
  CareerJob: (props) => <CareerJob {...props} />,
};

const SVGImages = {
  ...SVGIcons,
  Services: SVGServices,
  Astrologers: SVGAstrologer,
};

export default SVGImages;
