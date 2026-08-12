




import { useEffect, useState } from "react";
import "./App.css";
import MusicPlayer from "./components/MusicPlayer";

function App() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const playHorn = () => {
    const horns = [
      "/horn/horn1.mp3",
      "/horn/horn2.mp3",
    ];

    const randomHorn =
      horns[Math.floor(Math.random() * horns.length)];

    const audio = new Audio(randomHorn);
    audio.play();
  };

  return (
    <div className="app">

      <video
        className="background-video"
        autoPlay
        muted
        loop
        playsInline
      >
        <source
          src="./public/video/bg.mp4"
          type="video/mp4"
        />
      </video>

      {/* Clock */}
      <div className="clock">
        {time.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
      </div>

      {/* Horn */}
      <button
        className="horn-button"
        onClick={playHorn}
        title="Honk!"
      >
        📯
      </button>

      <MusicPlayer />

    </div>
  );
}

export default App;