
import React, { useState, useEffect, useRef } from "react";
import "./App.css";

// Generate snowflakes
const snowflakes = Array.from({ length: 65 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  delay: Math.random() * 10,
  duration: 5 + Math.random() * 10,
  size: 8 + Math.random() * 15,
}));

function App() {
  const [page, setPage] = useState(1);
  const [dob, setDob] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [giftOpened, setGiftOpened] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);

  const audioRef = useRef(null);

  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Today's date in local timezone
  const today = new Date();

  const maxDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  // CHRISTMAS COUNTDOWN
  useEffect(() => {
    const updateCountdown = () => {
      const eventDate = new Date(2026, 11, 25, 18, 0, 0);
      const difference = eventDate.getTime() - Date.now();

      if (difference <= 0) {
        setCountdown({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
        return;
      }

      setCountdown({
        days: Math.floor(difference / 86400000),
        hours: Math.floor((difference / 3600000) % 24),
        minutes: Math.floor((difference / 60000) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    updateCountdown();

    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, []);

  // AUTOMATIC MUSIC WHEN GIFT PAGE APPEARS
  useEffect(() => {
    if (page === 3 && audioRef.current) {
      audioRef.current.play()
        .then(() => setMusicPlaying(true))
        .catch(() => setMusicPlaying(false));
    }
  }, [page]);

  // AGE VERIFICATION
  const checkAge = () => {
    if (!dob) {
      setError("Please select your date of birth!");
      return;
    }

    const birth = new Date(dob + "T00:00:00");
    const current = new Date();

    if (birth > current) {
      setError("Please select a valid date!");
      return;
    }

    let age = current.getFullYear() - birth.getFullYear();

    const birthdayPassed =
      current.getMonth() > birth.getMonth() ||
      (current.getMonth() === birth.getMonth() &&
        current.getDate() >= birth.getDate());

    if (!birthdayPassed) age--;

    if (age >= 18) {
      setError("");
      setPage(2);
    } else {
      setError(
        "Sorry! This invitation is only for people aged 18 and above."
      );
    }
  };

  // NAME SUBMISSION
  const submitName = () => {
    if (!name.trim()) {
      setError("Please enter your name!");
      return;
    }

    setError("");
    setPage(3);
  };

  // OPEN GIFT AND START MUSIC
  const openGift = async () => {
    setGiftOpened(true);

    if (audioRef.current) {
      try {
        await audioRef.current.play();
        setMusicPlaying(true);
      } catch (err) {
        setMusicPlaying(false);
      }
    }
  };

  // PLAY / PAUSE MUSIC
  const toggleMusic = async () => {
    if (!audioRef.current) return;

    try {
      if (musicPlaying) {
        audioRef.current.pause();
      } else {
        await audioRef.current.play();
      }
    } catch (err) {
      console.log("Music playback failed:", err);
    }
  };

  // WHATSAPP SHARING
  const shareInvitation = () => {
    const message = `
🎄 MERRY CHRISTMAS! 🎄

Hello! ${name} invites you to celebrate Christmas!

🎅 Christmas Celebration
📅 Date: December 25, 2026
⏰ Time: 6:00 PM onwards
📍 Venue: [Your Venue]

Food • Music • Games • Joy

Let's make beautiful memories together! ❤️

We hope to see you there!
    `;

    const whatsappURL =
      "https://wa.me/?text=" + encodeURIComponent(message);

    window.open(whatsappURL, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="christmas">

      {/* FALLING SNOW */}
      <div className="snow-container">
        {snowflakes.map((snow) => (
          <span
            key={snow.id}
            className="snowflake"
            style={{
              left: `${snow.left}%`,
              animationDelay: `${snow.delay}s`,
              animationDuration: `${snow.duration}s`,
              fontSize: `${snow.size}px`,
            }}
          >
            ❄
          </span>
        ))}
      </div>

      {/* CHRISTMAS MUSIC */}
      <audio
        ref={audioRef}
        src="/music/christmas.mp3"
        loop
        preload="auto"
        onPlay={() => setMusicPlaying(true)}
        onPause={() => setMusicPlaying(false)}
      />

      {/* MUSIC CONTROL */}
      <button
        className="music-button"
        onClick={toggleMusic}
        aria-label={musicPlaying ? "Pause music" : "Play music"}
      >
        {musicPlaying ? "🔊 Music On" : "🎵 Play Music"}
      </button>

      {/* PAGE 1 - DATE OF BIRTH */}
      {page === 1 && (
        <div className="card">

          <div className="top-decoration">🎄</div>

          <h1>Merry Christmas</h1>

          <p className="subtitle">
            Something magical is waiting for you!
          </p>

          <h2>Before we begin...</h2>

          <p>Please confirm your date of birth</p>

          <input
            type="date"
            value={dob}
            max={maxDate}
            onChange={(e) => {
              setDob(e.target.value);
              setError("");
            }}
          />

          {error && <p className="error">{error}</p>}

          <button className="main-button" onClick={checkAge}>
            Continue ✨
          </button>

          <div className="bottom-decoration">
            ✨ ❄️ 🎅 ❄️ ✨
          </div>

        </div>
      )}

      {/* PAGE 2 - NAME */}
      {page === 2 && (
        <div className="card">

          <div className="top-decoration">🎅</div>

          <h1>Ho Ho Ho!</h1>

          <p className="subtitle">
            You're on the nice list!
          </p>

          <h2>What should we call you?</h2>

          <p>Enter your beautiful name below</p>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            maxLength={50}
            autoComplete="given-name"
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") submitName();
            }}
          />

          {error && <p className="error">{error}</p>}

          <button className="main-button" onClick={submitName}>
            Continue to Your Surprise 🎁
          </button>

          <div className="bottom-decoration">
            🎄 ✨ 🎁 ✨ 🎄
          </div>

        </div>
      )}

      {/* PAGE 3 - GIFT OPENING */}
      {page === 3 && (
        <div className="card gift-card">

          {!giftOpened ? (
            <>
              <p className="subtitle">
                A special Christmas surprise for you, {name}!
              </p>

              <h1>Open Your Gift</h1>

              <div
                className="gift-container"
                onClick={openGift}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    openGift();
                  }
                }}
                aria-label="Open Christmas gift"
              >
                <div className="gift-glow"></div>

                <div className="gift-box">

                  <div className="gift-lid">
                    <div className="gift-bow">🎀</div>
                  </div>

                  <div className="gift-body">
                    <div className="gift-ribbon"></div>
                  </div>

                </div>
              </div>

              <h2>Something magical awaits!</h2>

              <p>Tap the gift box to open your surprise.</p>
            </>
          ) : (
            <div className="gift-reveal">

              <div className="gift-sparkle">
                ✨ 🎉 ✨
              </div>

              <h1>Surprise!</h1>

              <p className="subtitle">
                Your Christmas invitation is ready!
              </p>

              <button
                className="main-button"
                onClick={() => setPage(4)}
              >
                Reveal My Invitation ❤️
              </button>

            </div>
          )}

        </div>
      )}

      {/* PAGE 4 - FINAL INVITATION */}
      {page === 4 && (
        <div className="invitation">

          <div className="invitation-sparkles">
            ✨ ❄️ ✨ 🎄 ✨
          </div>

          <p className="invitation-label">
            A SPECIAL INVITATION FOR
          </p>

          <h1>You're Invited!</h1>

          <div className="gold-line"></div>

          <h2>Merry Christmas, {name}! 🎄</h2>

          <p className="invite-text">
            The most wonderful time of the year is here!
            We would love to have you join us for a
            magical Christmas celebration filled with
            happiness, laughter and unforgettable memories.
          </p>

          {/* EVENT DETAILS */}
          <div className="event-details">

            <h2>🎄 Christmas Celebration 🎄</h2>

            <div className="detail-row">
              <span>📅</span>
              <p>
                <b>Date</b>
                December 21,2026
              </p>
            </div>

            <div className="detail-row">
              <span>⏰</span>
              <p>
                <b>Time</b>
                10:00 AM onwards
              </p>
            </div>

            <div className="detail-row">
              <span>📍</span>
              <p>
                <b>Venue</b>
                MY HOUSE
              </p>
            </div>

          </div>

          {/* CHRISTMAS COUNTDOWN */}
          <div className="countdown-section">

            <h2>Christmas Countdown</h2>

            <p>The magic begins in...</p>

            <div className="countdown">

              <div className="countdown-box">
                <strong>{countdown.days}</strong>
                <span>Days</span>
              </div>

              <div className="countdown-box">
                <strong>{String(countdown.hours).padStart(2, "0")}</strong>
                <span>Hours</span>
              </div>

              <div className="countdown-box">
                <strong>{String(countdown.minutes).padStart(2, "0")}</strong>
                <span>Minutes</span>
              </div>

              <div className="countdown-box">
                <strong>{String(countdown.seconds).padStart(2, "0")}</strong>
                <span>Seconds</span>
              </div>

            </div>

          </div>

          <div className="celebration-text">
            Food • Music • Games • Joy
          </div>

          <p className="invite-footer">
            Let's make beautiful memories together!
          </p>

          {/* WHATSAPP SHARING */}
          <button
            className="whatsapp-button"
            onClick={shareInvitation}
          >
            💬 Share Invitation on WhatsApp
          </button>

          <div className="footer">
            With love and Christmas wishes ❤️
          </div>

          <div className="invitation-sparkles">
            🎅 ❄️ ✨ 🎁
          </div>

        </div>
      )}

    </div>
  );
}

export default App;
