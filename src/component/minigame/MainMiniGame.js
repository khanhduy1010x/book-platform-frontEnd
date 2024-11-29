import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Stage, Sky } from "@react-three/drei";
import Ground from "./Ground.js";

function MainMiniGame() {
    const [loadingProgress, setLoadingProgress] = useState(0); 

  const [isHidden, setIsHidden] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev < 100) {
          return prev + 2; 
        } else {
          clearInterval(timer);
          setIsHidden(false);
          return 100;
        }
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {isHidden && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            backgroundColor: "black",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            color: "white",
          }}
        >
             
          <div
            style={{
                position:"relative",
              width: "50%",
              height: "20px",
              backgroundColor: "#444",
              borderRadius: "10px",
              marginTop: "20px",
            }}
          >
             <div                        

            style={{
              position: "absolute",
              left: `${loadingProgress-7}%`, 
              transition: "left 0.1s ease-out", 
              top: "-60px", 
              zIndex: 2000,
            }}
            className="flex items-center justify-center transition-all duration-300 ease-out"
          >
            <i className="fa-solid fa-ufo fa-spin-pulse text-[48px]"></i>
          </div>
            <div
            className="transition-all duration-300 ease-out"
              style={{
                width: `${loadingProgress}%`,
                height: "100%",
                backgroundColor: "#4caf50",
                borderRadius: "10px",
                transition: "width 0.1s",
              }}
            ></div>
          </div>
        
          <p className="font-bold font-oswald text-[22px]">
            {loadingProgress}% 
          </p>
        </div>
      )}

  
    <Suspense fallback={null}>
      <Canvas style={{ width: "100%", height: "100vh", position: "absolute",visibility: isHidden ? "hidden" : "visible"
 }}>
        <Stage>
          <Sky
            distance={5000}
            sunPosition={[100, 10, -1000]}
            inclination={0}
            azimuth={0.25}
          />
          <Ground frustumCulled />
        </Stage>
      </Canvas>
    </Suspense>
    </>
  );
}

export default MainMiniGame;
