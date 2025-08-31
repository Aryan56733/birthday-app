import React, { useState, useRef } from "react";
import Confetti from "react-confetti";
import personPhoto from "./assets/person.jpg"; // 🎂 Replace with your photo
import musicFile from "./assets/music.mp3"; // 🎵 Replace with your music
import balloon1 from "./assets/balloon1.png";
import balloon2 from "./assets/balloon2.png";
import balloon3 from "./assets/balloon3.png";
import "./App.css";

function App() {
  const [lightsOn, setLightsOn] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

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

  return (
    <div className={`app ${lightsOn ? "lights-on" : "lights-off"}`}>
      {!lightsOn ? (
        <button className="light-button" onClick={() => setLightsOn(true)}>
          Turn Lights On
        </button>
      ) : (
        <>
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={true}
          />

          <div className="card">
            <h1 className="sparkle">🎉 Happy Birthday 🎉</h1>
            <p className="wishes">
              Wishing you a day filled with love, laughter, and all your
              favorite things 💖
            </p>
            <img
              src={personPhoto}
              alt="Birthday Person"
              className="person-photo"
            />
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
