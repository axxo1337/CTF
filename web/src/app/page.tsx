"use client";

import Image from "next/image";
import useScroll from "@/utils/useScroll";
import Overlay from "@/components/ui/Overlay";
import Scoreboard from "@/components/ui/Scoreboard";

import { useState, useEffect, ReactElement, useRef } from "react";
import { Chip } from "@nextui-org/react";
import { AnimatePresence } from "framer-motion";
import Login from "@/components/ui/Login";

function Logged() {
  const soundOneRef = useRef();
  const soundTwoRef = useRef();
  const [sectionIndex, setSectionIndex] = useState(0);
  const [hasBegun, setHasBegun] = useState(false);

  const sections = [
    ["Intro", true],
    ["Reversing Engineering", true],
    ["Binary Exploitation", true],
    ["Cryptography", false],
    ["Web", false],
  ];

  const onSectionClick = (e: Event) => {
    let clickedId = parseInt(e.target.id);

    if (isNaN(clickedId)) clickedId = parseInt(e.target.parentElement.id);

    if (clickedId != sectionIndex) {
      soundTwoRef.current.muted = false;
      soundTwoRef.current.pause();
      soundTwoRef.current.currentTime = 0;
      soundTwoRef.current.play();
      setSectionIndex(clickedId);
    }
  };
  if (hasBegun) {
    return (
      <>
        <audio
          id="heartbeat"
          ref={soundTwoRef}
          src="/sounds/orb.ogg"
          preload="auto"
          autoPlay={true}
          muted={true}
        />

        <div className="flex flex-col gap-6 text-4xl font-bold">
          <h2>
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

function NotLogged() {
  return (
    <div className="flex flex-col gap-16 items-center">
      <h1 className="custom-border-3 text-9xl text-center">ACTF</h1>

      <time>0h 0min 0sec until start</time>

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
  const [overlay, setOverlay] = useState<ReactElement<any, any>>();
  const setScroll = useScroll();

  useEffect(() => {
    setScroll(overlay ? true : false);
  }, [overlay]);

  const switchOverlay = (new_overlay: ReactElement<any, any>) => {
    setOverlay(null);
    setOverlay(new_overlay);
  };

  const onLogin = () => {};

  const onLogOut = () => {};

  return (
    <>
      <header>
        <a className="custom-border-2 font-bold text-4xl">ACTF</a>

        <nav>
          {logged ? (
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
                <a className="custom-border-2"></a>
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
                  onClick={() => switchOverlay(<Login />)}
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
        {logged ? <Logged /> : <NotLogged />}
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
