"use client";

import Overlay from "@/components/ui/Overlay";
import Scoreboard from "@/components/ui/Scoreboard";

import axios from "axios";
import Login from "@/components/ui/Login";
import jwtDecode from "jwt-decode";
import { useState, useEffect, ReactElement, useRef } from "react";
import { Button, Chip, Spinner } from "@nextui-org/react";
import { AnimatePresence } from "framer-motion";
import { api_base_url } from "@/utils/utils";
import Challenge from "@/components/ui/Challenge";

function Logged({ hasBegun }: any) {
  const soundRef = useRef(null);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [sections, setSections] = useState([]);
  const [challenges, setChallenges] = useState([]);

  const fetchChallenges = (id) => {
    axios
      .get(api_base_url + "/v1/data/challenges/" + id, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setChallenges(res.data);
      });
  };

  useEffect(() => {
    if (!hasBegun) return;

    axios
      .get(api_base_url + "/v1/data/sections", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        let sectionsList = [];

        for (let i = 0; i < res.data.length; i++) {
          sectionsList.push([
            res.data[i].name,
            res.data[i].enabled,
            res.data[i].id,
          ]);
        }

        setSections(sectionsList);
      });
  }, []);

  useEffect(() => {
    if (!hasBegun) return;

    if (sections.length) fetchChallenges(sections[sectionIndex][2]);
  }, [sectionIndex, sections]);

  const onSend = (id: Number, flag: String) => {
    axios
      .get(api_base_url + "/v1/flag/validate?a=" + id + "&b=" + flag, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log(res);
      });
  };

  const onSectionClick = (e) => {
    let clickedId = parseInt(e.target.id);

    if (isNaN(clickedId)) clickedId = parseInt(e.target.parentElement.id);

    if (clickedId != sectionIndex) {
      soundRef.current.muted = false;
      soundRef.current.pause();
      soundRef.current.currentTime = 0;
      soundRef.current.play();
      setSectionIndex(clickedId);
    }
  };
  if (hasBegun) {
    return (
      <>
        <audio
          id="heartbeat"
          ref={soundRef}
          src="/sounds/orb.ogg"
          preload="auto"
          autoPlay={true}
          muted={true}
        />

        <div className="flex flex-col gap-6 font-bold">
          <h2 className="text-4xl">
            {sections.length ? (
              sections[sectionIndex][0]
            ) : (
              <span className="text-[var(--intense-color)]">ERROR</span>
            )}
          </h2>

          <div className="flex gap-4 items-center">
            <div className="w-[28px] h-[28px] bg-[#f5a523]" />

            {sections.length ? (
              sections.map((section, index) => {
                return (
                  <Chip
                    key={index}
                    id={index.toString()}
                    className={`hover:bg-[#f5a523] hover:text-[#000] duration-200 transition-colors cursor-pointer relative`}
                    onClick={onSectionClick}
                    color="warning"
                    variant={index == sectionIndex ? "solid" : "bordered"}
                    radius="none"
                    isDisabled={!section[1]}
                  >
                    {section[0]}
                  </Chip>
                );
              })
            ) : (
              <Chip
                className={`bg-[var(--intense-color)] duration-200 transition-colors cursor-pointer relative`}
                color="warning"
                variant="solid"
                radius="none"
              >
                No sections were fetched.
              </Chip>
            )}
          </div>

          <ul className="flex flex-col gap-5">
            {challenges.map((challenge, index) => (
              <li key={challenge.id}>
                <Challenge {...challenge} onSend={onSend} />
              </li>
            ))}
          </ul>
        </div>
      </>
    );
  }

  return (
    <h2 className="text-4xl font-bold absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      CTF has not started yet.
    </h2>
  );
}

function NotLogged({ time, hasBegun }: any) {
  const [timeLeft, setTimeLeft] = useState([-1, 0, 0, 0]);
  const [isIntervaled, setIsIntervaled] = useState(false);

  useEffect(() => {
    if (time == null || isIntervaled) return;

    const repeatTime = () => {
      const curr_date = new Date();

      const ctf_date = new Date(time);
      const diff_date = ctf_date.getDate() - curr_date.getDate();

      if (hasBegun) {
        setTimeLeft([diff_date < 0 ? -2 : -1, 0, 0, 0]);
        return;
      }

      setTimeLeft([
        Math.floor(diff_date / (1000 * 60 * 60 * 24)),
        Math.floor((diff_date / (1000 * 60 * 60)) % 24),
        Math.floor((diff_date / 1000 / 60) % 60),
        Math.floor((diff_date / 1000) % 60),
      ]);
    };

    repeatTime();

    setInterval(repeatTime, 1000);

    setIsIntervaled(true);
  }, [time]);

  return (
    <div className="flex flex-col gap-16 items-center">
      <h1 className="custom-border-3 text-9xl text-center">ACTF</h1>

      {timeLeft[0] == -1 ? (
        <span>CTF started!</span>
      ) : timeLeft[0] == -2 ? (
        <span>CTF is over!</span>
      ) : (
        <time>
          {timeLeft[0]} days {timeLeft[1]} hours {timeLeft[2]} minutes{" "}
          {timeLeft[3]} seconds until start
        </time>
      )}

      <p className="text-center">
        This is a private{" "}
        <a
          className="text-[var(--custom-color)]"
          href="https://en.wikipedia.org/wiki/Capture_the_flag_(cybersecurity)"
        >
          Capture The Flag
        </a>{" "}
        competition organized by{" "}
        <a
          className="text-[var(--custom-color)]"
          href="https://www.youtube.com/@axxo1337"
        >
          aXXo
        </a>
        . There will be only one winner who will have a small prize, and the
        whole competition will be recorded and uploaded on his{" "}
        <a
          className="text-[var(--intense-color)]"
          href="https://www.youtube.com/@axxo1337"
        >
          YouTube channel
        </a>
        .
      </p>

      <div className="w-full flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <div className="w-[25px] h-[25px] bg-[var(--custom-color)]" />
            <b className="text-xl">Rules</b>
          </div>

          <ul className="list-disc list-inside text-sm ml-2">
            <li>Attacking the platform is prohibited.</li>
            <li>Taking down challenge servers is prohibited.</li>
            <li>Leaking flags is prohibited.</li>
            <li>Leaking challenge files is prohibited.</li>
            <li>Bruteforcing is prohibited.</li>
            <li>
              <span className="text-[var(--intense-color)]">
                Breaking any of the above WILL get you banned.
              </span>
            </li>
          </ul>
        </div>

        <iframe
          src="https://discord.com/widget?id=1120021631583129676&theme=dark"
          width="auto"
          height="auto"
          sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
        ></iframe>
      </div>
    </div>
  );
}

export default function Home() {
  const [logged, setLogged] = useState(false);
  const [loading, setLoading] = useState(true);
  const [overlay, setOverlay] = useState<ReactElement<any, any>>();
  const [time, setTime] = useState(null);
  const [hasBegun, setHasBegun] = useState(false);

  useEffect(() => {
    axios.get(api_base_url + "/v1/data/time").then((res) => {
      setTime(parseInt(res.data));
    });

    const date = new Date();
    setHasBegun(date.getTime() >= time);

    console.log(date.getTime())

    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken: {exp: number} = jwtDecode(token);

      if (decodedToken.exp * 1000 > new Date().getTime()) {
        setLogged(true);
      }
    }

    if (loading) setLoading(false);
  }, []);

  const switchOverlay = (new_overlay: ReactElement<any, any>) => {
    setOverlay(null);
    setOverlay(new_overlay);
  };

  const onAuthEvent = (token: string) => {
    if (token == "") {
      localStorage.setItem("token", "");
      setLogged(false);
      return;
    }

    localStorage.setItem("token", token);
    setLogged(true);
    setOverlay(null);
  };

  return (
    <>
      <header>
        <a className="custom-border-2 font-bold text-4xl">ACTF</a>

        <nav>
          {loading ? (
            ""
          ) : logged ? (
            <ul>
              <li>
                <a
                  className="custom-border-2"
                  onClick={() => switchOverlay(<Scoreboard />)}
                >
                  󱉾
                </a>
              </li>
              <li>
                <a
                  className="custom-border-2"
                  onClick={() => {
                    onAuthEvent("");
                  }}
                >
                  
                </a>
              </li>
            </ul>
          ) : (
            <ul>
              <li>
                <a
                  className="custom-border-2"
                  onClick={() => switchOverlay(<Scoreboard />)}
                >
                  󱉾
                </a>
              </li>
              <li>
                <a
                  className="custom-border-2"
                  onClick={() =>
                    switchOverlay(<Login onSuccess={onAuthEvent} />)
                  }
                >
                  
                </a>
              </li>
            </ul>
          )}
        </nav>
      </header>
      <main
        className={
          logged ? "mt-6" : "flex items-center justify-center relative h-full"
        }
      >
        {loading ? (
          <Spinner color="default" labelColor="foreground" size="lg" />
        ) : (
          <>
            {logged ? (
              <Logged hasBegun={hasBegun} />
            ) : (
              <NotLogged time={time} hasBegun={hasBegun} />
            )}
          </>
        )}
      </main>
      <AnimatePresence>
        {overlay != null ? (
          <Overlay
            onClose={() => {
              setOverlay(null);
            }}
          >
            {overlay}
          </Overlay>
        ) : (
          ""
        )}
      </AnimatePresence>
    </>
  );
}
