"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import SplashScreen from "./splashscreencompoents/splashscreen";
import WelcomePage from "./splashscreencompoents/WelcomePage";

// Import individual slide components


export default function MyComponent() {
  return (
    <div className="h-screen">
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={false}
        onReachEnd={(swiper) => swiper.autoplay.stop()}
        slidesPerView={1}
        className="h-full" // Make Swiper fill parent
      >
        <SwiperSlide className="h-full"> 
          <div className="h-full">
            <SplashScreen />
          </div>
        </SwiperSlide>

        <SwiperSlide className="h-full">
          <div className="h-full">
            <WelcomePage />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}