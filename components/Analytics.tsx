"use client";

import { useEffect } from "react";
import analytics from "roaarrr-browser";

export function Analytics() {
  useEffect(() => {
    analytics.init(
      "eyJhbGciOiJIUzI1NiJ9.eyJwcm9qZWN0SWQiOiJhYzA1MjczNy0xNGQ0LTRlZTEtYjE0OC04Yzc3ZTA5MDExNzciLCJpYXQiOjE3ODQzMTQxMjIsImV4cCI6MTgxNTg3MTcyMn0.Gv4XFhu4pxJDYyVscxgIDcg9tcUPMG6nAtXhuuL85wY"
    );

    analytics.funnel("activation");
  }, []);

  return null;
}
