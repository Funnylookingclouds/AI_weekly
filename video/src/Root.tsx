import React from "react";
import { Composition } from "remotion";
import { WeeklyShort, DURATION } from "./WeeklyShort";
import { FPS } from "./timing";

export const Root: React.FC = () => (
  <Composition id="WeeklyShort" component={WeeklyShort} durationInFrames={DURATION} fps={FPS} width={1080} height={1920} />
);
