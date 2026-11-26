/** Week 47 – ENSEMBLE redo on the 2.5D studio (layout v2). Boards reused from w47p. Voice: scripts/episodes/2026-w47-en.* */
import { C as T } from "../theme";
import { CHARACTERS } from "../presenter/characters";
import { word, seg, type Show } from "../presenter/Show";
import { MillionProblem, NotEvenBiggest, Riemann, Years167, ProofLines, UnderReview, Historic, SavesLives, HeartBars, SwedishData, QuickHit, DataStays, Recap } from "./w47p";

export const WEEK_LABEL = "WK 47";
export const SEG_COLOR: Record<string, string> = { hook: T.amber, news1: T.amber, news2: T.pink, news3: T.green, loop: T.purple };
const TINT = { hook: "#8b5cf6", math: "#f59e0b", doubt: "#ef4444", heart: "#e11d48", data: "#3b82f6", laptop: "#22c55e" };
const S1 = "STORY 1/3 · MATH", S2 = "STORY 2/3 · HEART", S3 = "STORY 3/3 · PRIVACY";

export const SHOW: Show = {
  presenter: CHARACTERS.wattson,
  stage: true,
  plates: [
    { t: 0, C: MillionProblem, mood: "body", tint: TINT.hook, chip: "THIS WEEK", cast: [{ id: "pixel", expr: "surprised" }, { id: "lumi", expr: "surprised", talk: true }, { id: "chip", expr: "love" }] },
    { t: word("hook", "and"), C: NotEvenBiggest, mood: "body", tint: TINT.hook, chip: "THIS WEEK", cast: [{ id: "pixel", expr: "confused" }, { id: "lumi", expr: "smug", talk: true }, { id: "chip", expr: "surprised" }] },
    { t: seg("news1"), C: Riemann, mood: "body", tint: TINT.math, chip: S1, cast: [{ id: "pixel", expr: "happy", talk: true }, { id: "lumi", expr: "surprised" }] },
    { t: word("news1", "a", 1), C: Years167, mood: "body", tint: TINT.math, chip: S1, cast: [{ id: "lumi", expr: "surprised", talk: true }, { id: "pixel", expr: "happy" }] },
    { t: word("news1", "proof", 1), C: ProofLines, mood: "body", tint: TINT.math, chip: S1, cast: [{ id: "lumi", expr: "happy", talk: true }, { id: "pixel", expr: "love" }, { id: "chip", expr: "neutral" }] },
    { t: word("news1", "experts"), C: UnderReview, mood: "body", tint: TINT.doubt, chip: S1, cast: [{ id: "chip", expr: "scared", talk: true }, { id: "lumi", expr: "confused" }] },
    { t: word("news1", "if"), C: Historic, mood: "body", tint: TINT.math, chip: S1, cast: [{ id: "chip", expr: "surprised", talk: true }, { id: "lumi", expr: "laugh" }] },
    { t: seg("news2"), C: SavesLives, mood: "body", tint: TINT.heart, chip: S2, cast: [{ id: "lumi", expr: "love", talk: true }, { id: "cloudy", expr: "happy" }] },
    { t: word("news2", "found"), C: HeartBars, mood: "body", tint: TINT.heart, chip: S2, cast: [{ id: "lumi", expr: "happy", talk: true }, { id: "cloudy", expr: "surprised" }] },
    { t: word("news2", "and"), C: SwedishData, mood: "body", tint: TINT.data, chip: S2, cast: [{ id: "cloudy", expr: "neutral", talk: true }, { id: "lumi", expr: "surprised" }] },
    { t: seg("news3"), C: QuickHit, mood: "body", tint: TINT.laptop, chip: S3, cast: [{ id: "wattson", expr: "neutral", talk: true }, { id: "pixel", expr: "happy" }] },
    { t: word("news3", "smart"), C: DataStays, mood: "body", tint: TINT.laptop, chip: S3, cast: [{ id: "wattson", expr: "smug", talk: true }, { id: "pixel", expr: "love" }] },
    { t: seg("loop"), C: Recap, mood: "body", tint: TINT.hook, chip: "RECAP", cast: [{ id: "wattson", expr: "smug" }, { id: "chip", expr: "happy" }, { id: "pixel", expr: "laugh", talk: true }, { id: "lumi", expr: "happy" }, { id: "cloudy", expr: "laugh" }] },
  ],
};
