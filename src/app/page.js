"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import SplashScreen from "./splashscreencompoents/splashscreen";
import WelcomePage from "./splashscreencompoents/WelcomePage";

// Import individual slide components


export default function Home() {
  return (
    <div className="h-screen">
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={false}
        onReachEnd={(swiper) => swiper.autoplay.stop()}
        slidesPerView={1}
      >
        <SwiperSlide>
          <SplashScreen/>
        </SwiperSlide>
        
        <SwiperSlide>
          <WelcomePage/>
        </SwiperSlide>
        
        
      </Swiper>
    </div>
  );
}