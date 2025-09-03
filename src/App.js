import React, { useState, useRef, useEffect } from "react";
import Confetti from "react-confetti";
import { Fireworks } from "fireworks-js";
import personPhoto from "./assets/person.jpg"; 
import musicFile from "./assets/music.mp3"; 
import balloon1 from "./assets/balloon1.png";
import balloon2 from "./assets/balloon2.png";
import balloon3 from "./assets/balloon3.png";
import "./App.css";

function App() {
  const [lightsOn, setLightsOn] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const fireworksRef = useRef(null);
  const containerRef = useRef(null);

  const balloons = [balloon1, balloon2, balloon3];

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch((e) => console.log("Play blocked:", e));
      setIsPlaying(true);
    }
  };

  // 🎆 Setup Fireworks after lights turn on
  useEffect(() => {
    if (lightsOn && containerRef.current) {
      fireworksRef.current = new Fireworks(containerRef.current, {
        rocketsPoint: { min: 50, max: 50 },
        hue: { min: 0, max: 360 },
        delay: { min: 15, max: 30 },
        speed: 2,
        acceleration: 1.05,
        friction: 0.95,
        gravity: 1.5,
        particles: 100,
        trace: 3,
        explosion: 5,
      });
      fireworksRef.current.start();
    }

    return () => {
      if (fireworksRef.current) {
        fireworksRef.current.stop();
      }
    };
  }, [lightsOn]);

  return (
    <div className={`app ${lightsOn ? "lights-on" : "lights-off"}`}>
      {/* Fireworks container */}
      <div ref={containerRef} className="fireworks-container"></div>

      {!lightsOn ? (
        <button className="light-button" onClick={() => setLightsOn(true)}>
          Turn Lights On
        </button>
      ) : (
        <>
          <Confetti width={window.innerWidth} height={window.innerHeight} recycle={true} />

          <div className="card">
            <h1 className="sparkle">🎉 Happy Birthday 🎉</h1>
            <p className="wishes">
              Wishing you a day filled with love, laughter, and all your favorite things 💖
            </p>
            <img src={personPhoto} alt="Birthday Person" className="person-photo" />
            <br />
            <button className="music-btn" onClick={toggleMusic}>
              {isPlaying ? "⏸ Pause Music" : "▶ Play Music 🎶"}
            </button>
            <audio ref={audioRef} src={musicFile} loop preload="auto" />
          </div>

          {/* Balloons floating */}
          <div className="balloon-container">
            {Array.from({ length: 12 }).map((_, index) => {
              const src = balloons[index % balloons.length];
              const leftPos = Math.random() * 90;
              const duration = 10 + Math.random() * 10;
              const size = 60 + Math.random() * 50;
              return (
                <img
                  key={index}
                  src={src}
                  alt="balloon"
                  className="floating-balloon"
                  style={{
                    left: `${leftPos}%`,
                    animationDuration: `${duration}s`,
                    width: `${size}px`,
                  }}
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
