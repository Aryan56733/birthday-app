import React, { useState, useRef, useEffect } from "react";
import Confetti from "react-confetti";
import { Fireworks } from "fireworks-js";
import { motion } from "framer-motion";
import personPhoto from "./assets/person.jpeg";
import musicFile from "./assets/music.mp3";
import balloon1 from "./assets/balloon1.png";
import balloon2 from "./assets/balloon2.png";
import balloon3 from "./assets/balloon3.png";
import "./App.css";

function HeartCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const rand = Math.random;

    const heartPosition = (rad) => [
      Math.pow(Math.sin(rad), 3),
      -(
        15 * Math.cos(rad) -
        5 * Math.cos(2 * rad) -
        2 * Math.cos(3 * rad) -
        Math.cos(4 * rad)
      ),
    ];

    const scaleAndTranslate = (pos, sx, sy, dx, dy) => [
      dx + pos[0] * sx,
      dy + pos[1] * sy,
    ];

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      ctx.fillStyle = "rgba(0,0,0,1)";
      ctx.fillRect(0, 0, width, height);
    };
    window.addEventListener("resize", resize);

    const traceCount = 50;
    const pointsOrigin = [];
    const dr = 0.1;
    for (let i = 0; i < Math.PI * 2; i += dr)
      pointsOrigin.push(scaleAndTranslate(heartPosition(i), 210, 13, 0, 0));
    for (let i = 0; i < Math.PI * 2; i += dr)
      pointsOrigin.push(scaleAndTranslate(heartPosition(i), 150, 9, 0, 0));
    for (let i = 0; i < Math.PI * 2; i += dr)
      pointsOrigin.push(scaleAndTranslate(heartPosition(i), 90, 5, 0, 0));

    const heartPointsCount = pointsOrigin.length;
    const targetPoints = [];

    const pulse = (kx, ky) => {
      for (let i = 0; i < pointsOrigin.length; i++) {
        targetPoints[i] = [
          kx * pointsOrigin[i][0] + width / 2,
          ky * pointsOrigin[i][1] + height / 2,
        ];
      }
    };

    const e = [];
    for (let i = 0; i < heartPointsCount; i++) {
      const x = rand() * width;
      const y = rand() * height;
      e[i] = {
        vx: 0,
        vy: 0,
        speed: rand() * 0.5 + 3, // slightly slower for smoother trails
        q: ~~(rand() * heartPointsCount),
        D: 2 * (i % 2) - 1,
        force: 0.2 * rand() + 0.8,
        f: `hsla(${~~(360 * rand())},100%,70%,0.6)`, // brighter, more colorful
        trace: Array.from({ length: traceCount }, () => ({ x, y })),
      };
    }

    const config = { traceK: 0.4, timeDelta: 0.01 };
    let time = 0;

    const loop = () => {
      const n = -Math.cos(time);
      pulse((1 + n) * 0.5, (1 + n) * 0.5);
      time += (Math.sin(time) < 0 ? 9 : n > 0.8 ? 0.2 : 1) * config.timeDelta;
      ctx.fillStyle = "rgba(0,0,0,0.07)"; // lighter fade → keeps trails longer
      ctx.fillRect(0, 0, width, height);

      for (let i = e.length; i--; ) {
        const u = e[i];
        const q = targetPoints[u.q];
        const dx = u.trace[0].x - q[0];
        const dy = u.trace[0].y - q[1];
        const length = Math.sqrt(dx * dx + dy * dy);
        if (length < 10) {
          if (rand() > 0.95) u.q = ~~(rand() * heartPointsCount);
          else {
            if (rand() > 0.99) u.D *= -1;
            u.q = (u.q + u.D + heartPointsCount) % heartPointsCount;
          }
        }
        u.vx += (-dx / length) * u.speed;
        u.vy += (-dy / length) * u.speed;
        u.trace[0].x += u.vx;
        u.trace[0].y += u.vy;
        u.vx *= u.force;
        u.vy *= u.force;
        for (let k = 0; k < u.trace.length - 1; ) {
          const T = u.trace[k];
          const N = u.trace[++k];
          N.x -= config.traceK * (N.x - T.x);
          N.y -= config.traceK * (N.y - T.y);
        }
        ctx.fillStyle = u.f;
        for (let k = 0; k < u.trace.length; k++)
          ctx.fillRect(u.trace[k].x, u.trace[k].y, 1.5, 1.5); // slightly larger dots
      }
      requestAnimationFrame(loop);
    };
    loop();

    return () => window.removeEventListener("resize", resize);
  }, []);

  return <canvas ref={canvasRef} className="heart-canvas"></canvas>;
}

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

  useEffect(() => {
    if (lightsOn && containerRef.current) {
      fireworksRef.current = new Fireworks(containerRef.current);
      fireworksRef.current.start();
    }
    return () => fireworksRef.current?.stop();
  }, [lightsOn]);

  return (
    <div className={`app ${lightsOn ? "lights-on" : "lights-off"}`}>
      {/* Heart animation background */}
      <HeartCanvas />

      {/* Fireworks container */}
      <div ref={containerRef} className="fireworks-container"></div>

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

          <motion.div
            className="card"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="sparkle">🎉 A Very Happy Birthday Kunnu Singh🎉</h1>
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
          </motion.div>

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
