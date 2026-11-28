/** Week 44 – ENSEMBLE redo on the 2.5D studio (hanging boards, topic chips). Boards reused from w44p. Voice: scripts/episodes/2026-w44-en.* */
import { C as T } from "../theme";
import { CHARACTERS } from "../presenter/characters";
import { word, seg, type Show } from "../presenter/Show";
import { ThreeProblems, SingleDay, LocalSmoothing, AlsoCracks, MoreClaims, CheckedNotReviewed, PromptToWorld, SoundDialogue, WeatherSwitch, RobotMax, FiveFingers, Recap } from "./w44p";

export const WEEK_LABEL = "WK 44";
export const SEG_COLOR: Record<string, string> = { hook: T.purple, news1: T.amber, news2: T.cyan, news3: T.pink, loop: T.purple };
const TINT = { hook: "#8b5cf6", math: "#f59e0b", doubt: "#ef4444", world: "#06b6d4", weather: "#3b82f6", robot: "#ec4899" };
const S1 = "STORY 1/3 · MATH", S2 = "STORY 2/3 · WORLDS", S3 = "STORY 3/3 · ROBOTS";

export const SHOW: Show = {
  presenter: CHARACTERS.wattson,
  stage: true,
  poster: { title: "AI claims 3 of science's hardest problems", kicker: "WEEK 44 \u00b7 WHAT DID AI SOLVE?" },
  plates: [
    { t: 0, C: ThreeProblems, mood: "body", tint: TINT.hook, chip: "THIS WEEK", cast: [{ id: "lumi", expr: "surprised", talk: true }, { id: "pixel", expr: "happy" }, { id: "chip", expr: "scared" }] },
    { t: word("hook", "in", 1), C: SingleDay, mood: "body", tint: TINT.hook, chip: "THIS WEEK", cast: [{ id: "lumi", expr: "happy", talk: true }, { id: "pixel", expr: "surprised" }, { id: "chip", expr: "surprised" }] },
    { t: seg("news1"), C: LocalSmoothing, mood: "body", tint: TINT.math, chip: S1, cast: [{ id: "lumi", expr: "smug", talk: true }, { id: "wattson", expr: "confused" }] },
    { t: word("news1", "which"), C: AlsoCracks, mood: "body", tint: TINT.math, chip: S1, cast: [{ id: "lumi", expr: "laugh", talk: true }, { id: "wattson", expr: "surprised" }] },
    { t: word("news1", "plus"), C: MoreClaims, mood: "body", tint: TINT.math, chip: S1, cast: [{ id: "pixel", expr: "happy", talk: true }, { id: "lumi", expr: "love" }, { id: "wattson", expr: "neutral" }] },
    { t: word("news1", "the", 1), C: CheckedNotReviewed, mood: "body", tint: TINT.doubt, chip: S1, cast: [{ id: "wattson", expr: "smug", talk: true }, { id: "lumi", expr: "confused" }] },
    { t: seg("news2"), C: PromptToWorld, mood: "body", tint: TINT.world, chip: S2, cast: [{ id: "pixel", expr: "surprised", talk: true }, { id: "cloudy", expr: "happy" }] },
    { t: word("news2", "now"), C: SoundDialogue, mood: "body", tint: TINT.world, chip: S2, cast: [{ id: "pixel", expr: "laugh", talk: true }, { id: "cloudy", expr: "surprised" }] },
    { t: word("news2", "and", 1), C: WeatherSwitch, mood: "body", tint: TINT.weather, chip: S2, cast: [{ id: "cloudy", expr: "love", talk: true }, { id: "pixel", expr: "laugh" }] },
    { t: seg("news3"), C: RobotMax, mood: "body", tint: TINT.robot, chip: S3, cast: [{ id: "chip", expr: "scared", talk: true }, { id: "pixel", expr: "happy" }] },
    { t: word("news3", "with"), C: FiveFingers, mood: "body", tint: TINT.robot, chip: S3, cast: [{ id: "chip", expr: "happy", talk: true }, { id: "pixel", expr: "surprised" }] },
    { t: seg("loop"), C: Recap, mood: "body", tint: TINT.hook, chip: "RECAP", cast: [{ id: "wattson", expr: "smug" }, { id: "chip", expr: "happy" }, { id: "lumi", expr: "happy", talk: true }, { id: "pixel", expr: "laugh" }, { id: "cloudy", expr: "laugh" }] },
  ],
};
