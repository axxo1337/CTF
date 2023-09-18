import { useState, useEffect } from "react";

export default function useScroll() {
  const [scroll, setScroll] = useState(true);

  const wheel = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  const preventDefault = (e: Event) => {
    e = e || window.event;
    if (e.preventDefault) {
      e.preventDefault();
    }
    e.returnValue = false;
  };

  const keydown = (e: KeyboardEvent) => {
    var keys = [32, 33, 34, 35, 36, 37, 38, 39, 40];
    for (var i = keys.length; i--; ) {
      if (e.keyCode === keys[i]) {
        preventDefault(e);
        return;
      }
    }
  };

  const EnableScroll = () => {
    document.removeEventListener("wheel", wheel, false);
    document.removeEventListener("mousewheel", wheel, false);
    document.removeEventListener("DOMMouseScroll", wheel, false);
    document.removeEventListener("touchmove", preventDefault, false);

    document.onmousemove = document.onkeydown = null;
  };

  const DisableScroll = () => {
    document.addEventListener("wheel", wheel, false);
    document.addEventListener("mousewheel", wheel, false);
    document.addEventListener("DOMMouseScroll", wheel, false);
    document.addEventListener("touchmove", preventDefault, false);

    document.onmousemove = wheel;
    document.onkeydown = keydown;
  };

  useEffect(() => {
    scroll ? EnableScroll() : DisableScroll();
  }, [scroll]);

  return setScroll;
}
