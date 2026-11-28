/** Week 46 – ENSEMBLE redo on the 2.5D studio (layout v2). Boards reused from w46p. Voice: scripts/episodes/2026-w46-en.* */
import { C as T } from "../theme";
import { CHARACTERS } from "../presenter/characters";
import { word, seg, type Show } from "../presenter/Show";
import { EightVsAI, OnlyTheStart, MayoTest, TumorTypes, Score97, BeatAll, TeamUp, SignalChat, ProofCheck, MillionsWeeks, BugsCaught, Helix, TwiceAsMany, Recap } from "./w46p";

export const WEEK_LABEL = "WK 46";
export const SEG_COLOR: Record<string, string> = { hook: T.cyan, news1: T.pink, news2: T.cyan, news3: T.green, loop: T.purple };
const TINT = { hook: "#8b5cf6", med: "#ec4899", win: "#f59e0b", lock: "#0ea5e9", bug: "#ef4444", dna: "#22c55e" };
const S1 = "STORY 1/3 · MEDICINE", S2 = "STORY 2/3 · PRIVACY", S3 = "STORY 3/3 · DNA";

export const SHOW: Show = {
  presenter: CHARACTERS.wattson,
  stage: true,
  poster: { title: "AI just beat 8 brain tumor experts", kicker: "WEEK 46 \u00b7 WHAT DID AI SOLVE?" },
  plates: [
    { t: 0, C: EightVsAI, mood: "body", tint: TINT.hook, chip: "THIS WEEK", cast: [{ id: "lumi", expr: "surprised" }, { id: "pixel", expr: "surprised", talk: true }, { id: "chip", expr: "scared" }] },
    { t: word("hook", "and"), C: OnlyTheStart, mood: "body", tint: TINT.hook, chip: "THIS WEEK", cast: [{ id: "lumi", expr: "happy" }, { id: "pixel", expr: "smug", talk: true }, { id: "chip", expr: "happy" }] },
    { t: seg("news1"), C: MayoTest, mood: "body", tint: TINT.med, chip: S1, cast: [{ id: "lumi", expr: "neutral", talk: true }, { id: "chip", expr: "confused" }] },
    { t: word("news1", "choosing"), C: TumorTypes, mood: "body", tint: TINT.med, chip: S1, cast: [{ id: "lumi", expr: "confused", talk: true }, { id: "chip", expr: "scared" }] },
    { t: word("news1", "it"), C: Score97, mood: "body", tint: TINT.win, chip: S1, cast: [{ id: "chip", expr: "surprised", talk: true }, { id: "lumi", expr: "laugh" }] },
    { t: word("news1", "beating"), C: BeatAll, mood: "body", tint: TINT.win, chip: S1, cast: [{ id: "chip", expr: "laugh", talk: true }, { id: "lumi", expr: "happy" }] },
    { t: word("news1", "even"), C: TeamUp, mood: "body", tint: TINT.med, chip: S1, cast: [{ id: "lumi", expr: "love", talk: true }, { id: "chip", expr: "love" }] },
    { t: seg("news2"), C: SignalChat, mood: "body", tint: TINT.lock, chip: S2, cast: [{ id: "wattson", expr: "neutral", talk: true }, { id: "pixel", expr: "happy" }] },
    { t: word("news2", "mathematically"), C: ProofCheck, mood: "body", tint: TINT.lock, chip: S2, cast: [{ id: "wattson", expr: "smug", talk: true }, { id: "pixel", expr: "surprised" }] },
    { t: word("news2", "millions"), C: MillionsWeeks, mood: "body", tint: TINT.lock, chip: S2, cast: [{ id: "wattson", expr: "surprised", talk: true }, { id: "pixel", expr: "laugh" }] },
    { t: word("news2", "when"), C: BugsCaught, mood: "body", tint: TINT.bug, chip: S2, cast: [{ id: "pixel", expr: "happy", talk: true }, { id: "wattson", expr: "smug" }] },
    { t: seg("news3"), C: Helix, mood: "body", tint: TINT.dna, chip: S3, cast: [{ id: "cloudy", expr: "happy", talk: true }, { id: "lumi", expr: "surprised" }] },
    { t: word("news3", "finding"), C: TwiceAsMany, mood: "body", tint: TINT.dna, chip: S3, cast: [{ id: "cloudy", expr: "surprised", talk: true }, { id: "lumi", expr: "love" }] },
    { t: seg("loop"), C: Recap, mood: "body", tint: TINT.hook, chip: "RECAP", cast: [{ id: "wattson", expr: "smug" }, { id: "chip", expr: "happy" }, { id: "pixel", expr: "happy", talk: true }, { id: "lumi", expr: "laugh" }, { id: "cloudy", expr: "laugh" }] },
  ],
};
