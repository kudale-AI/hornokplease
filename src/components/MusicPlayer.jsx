import { useEffect, useRef, useState } from "react";
import YouTube from "react-youtube";

const PLAYLIST_ID = "PLeatb7hupNV_AWUl_7ttbsKeCQh8tF5N4";

function MusicPlayer() {
  const playerRef = useRef(null);
  const intervalRef = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(70);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);

  const [song, setSong] = useState({
    title: "Horn OK Please",
    artist: "YouTube Music",
  });

  const opts = {
    width: "1",
    height: "1",
    playerVars: {
      autoplay: 0,
      controls: 0,
      rel: 0,
      playsinline: 1,
      listType: "playlist",
      list: PLAYLIST_ID,
    },
  };

  const onReady = (event) => {
    playerRef.current = event.target;

    event.target.setVolume(volume);

    setDuration(event.target.getDuration());

    updateSongInfo(event.target);
  };

  const updateSongInfo = (player) => {
    const data = player.getVideoData();

    if (data?.title) {
      setSong({
        title: data.title,
        artist: data.author || "YouTube Music",
      });
    }

    const videoDuration = player.getDuration();

    if (videoDuration) {
      setDuration(videoDuration);
    }
  };

  const onStateChange = (event) => {
    const state = event.data;

    if (state === 1) {
      setPlaying(true);
      updateSongInfo(event.target);
    }

    if (state === 2) {
      setPlaying(false);
    }

    // Playlist item ended
    if (state === 0) {
      if (repeat) {
        event.target.playVideo();
      } else {
        setPlaying(false);
      }
    }
  };

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const player = playerRef.current;

      if (!player) return;

      try {
        const current = player.getCurrentTime();
        const total = player.getDuration();

        setCurrentTime(current || 0);
        setDuration(total || 0);

        if (total > 0) {
          setProgress((current / total) * 100);
        }

        updateSongInfo(player);
      } catch {
        // Player may not be ready yet.
      }
    }, 500);

    return () => clearInterval(intervalRef.current);
  }, []);

  const togglePlay = () => {
    if (!playerRef.current) return;

    if (playing) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const previousSong = () => {
    if (!playerRef.current) return;

    playerRef.current.previousVideo();
    setTimeout(() => updateSongInfo(playerRef.current), 500);
  };

  const nextSong = () => {
    if (!playerRef.current) return;

    playerRef.current.nextVideo();
    setTimeout(() => updateSongInfo(playerRef.current), 500);
  };

  const toggleShuffle = () => {
    if (!playerRef.current) return;

    const newValue = !shuffle;

    setShuffle(newValue);

    playerRef.current.setShuffle(newValue);
  };

  const toggleRepeat = () => {
    setRepeat((value) => !value);
  };

  const toggleMute = () => {
    if (!playerRef.current) return;

    if (muted) {
      playerRef.current.unMute();
      playerRef.current.setVolume(volume);
    } else {
      playerRef.current.mute();
    }

    setMuted(!muted);
  };

  const changeVolume = (event) => {
    const value = Number(event.target.value);

    setVolume(value);

    if (!playerRef.current) return;

    playerRef.current.unMute();
    playerRef.current.setVolume(value);

    setMuted(value === 0);
  };

  const seek = (event) => {
    if (!playerRef.current || !duration) return;

    const value = Number(event.target.value);

    playerRef.current.seekTo((value / 100) * duration, true);
    setProgress(value);
  };

  const formatTime = (seconds) => {
    if (!seconds || Number.isNaN(seconds)) return "0:00";

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <YouTube
        videoId=""
        opts={opts}
        onReady={onReady}
        onStateChange={onStateChange}
        className="youtube-hidden"
      />

      <div className="music-player">
        <div className="music-left">
          <div className="album-art">
            <span>🚚</span>
          </div>

          <div className="song-info">
            <div className="song-title">{song.title}</div>
            <div className="song-artist">{song.artist}</div>
          </div>
        </div>

        <div className="music-center">
          <div className="player-controls">
            <button
              className={`control-button small ${
                shuffle ? "active" : ""
              }`}
              onClick={toggleShuffle}
              title="Shuffle"
            >
              ⤨
            </button>

            <button
              className="control-button"
              onClick={previousSong}
              title="Previous"
            >
              ⏮
            </button>

            <button
              className="play-button"
              onClick={togglePlay}
              title={playing ? "Pause" : "Play"}
            >
              {playing ? "Ⅱ" : "▶"}
            </button>

            <button
              className="control-button"
              onClick={nextSong}
              title="Next"
            >
              ⏭
            </button>

            <button
              className={`control-button small ${
                repeat ? "active" : ""
              }`}
              onClick={toggleRepeat}
              title="Repeat"
            >
              ↻
            </button>
          </div>

          <div className="progress-container">
            <span>{formatTime(currentTime)}</span>

            <input
              className="progress-bar"
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={progress}
              onChange={seek}
            />

            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="volume-section">
          <button
            className="volume-button"
            onClick={toggleMute}
            title={muted ? "Unmute" : "Mute"}
          >
            {muted || volume === 0 ? "🔇" : "🔊"}
          </button>

          <input
            className="volume-slider"
            type="range"
            min="0"
            max="100"
            value={muted ? 0 : volume}
            onChange={changeVolume}
          />
        </div>
      </div>
    </>
  );
}

export default MusicPlayer;