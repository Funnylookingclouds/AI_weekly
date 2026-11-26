/** Week 48 – ENSEMBLE redo on the 2.5D studio (layout v2): crew reports, Wattson hosts with grumpy asides. Boards from w48p. Voice: scripts/episodes/2026-w48-en.* */
import { CHARACTERS } from "../presenter/characters";
import { seg, word, type Show } from "../presenter/Show";
import { Mystery, NewHost, Remember, LeanOK, Reactions, PeerReview, Protein, Binders, Replacement, Timelines, NoMiracles, ChargeMe, H2, N1, N1B, N1C, N1D, N2B, N2C, N3, N3B } from "./w48p";
export { SEG_COLOR } from "./w48p";

export const WEEK_LABEL = "WK 48";
const TINT = { hook: "#8b5cf6", host: "#f97316", math: "#f59e0b", doubt: "#ef4444", bio: "#22c55e", pharma: "#06b6d4" };
const S1 = "STORY 1/3 · MATH", S2 = "STORY 2/3 · PROTEINS", S3 = "STORY 3/3 · MEDICINE";

export const SHOW: Show = {
  presenter: CHARACTERS.wattson,
  stage: true,
  plates: [
    { t: 0, C: Mystery, mood: "body", tint: TINT.hook, chip: "THIS WEEK", cast: [{ id: "lumi", expr: "surprised", talk: true }, { id: "wattson", expr: "neutral" }, { id: "pixel", expr: "surprised" }] },
    { t: H2, C: NewHost, mood: "body", tint: TINT.host, chip: "YOUR HOST", cast: [{ id: "lumi", expr: "happy" }, { id: "wattson", expr: "smug", talk: true }, { id: "pixel", expr: "laugh" }] },
    { t: N1, C: Remember, mood: "body", tint: TINT.math, chip: S1, cast: [{ id: "pixel", expr: "happy", talk: true }, { id: "wattson", expr: "confused" }] },
    { t: N1B, C: LeanOK, mood: "body", tint: TINT.math, chip: S1, cast: [{ id: "pixel", expr: "laugh", talk: true }, { id: "wattson", expr: "surprised" }] },
    { t: N1C, C: Reactions, mood: "body", tint: TINT.doubt, chip: S1, cast: [{ id: "chip", expr: "confused", talk: true }, { id: "wattson", expr: "smug" }] },
    { t: N1D, C: PeerReview, mood: "body", tint: TINT.doubt, chip: S1, cast: [{ id: "wattson", expr: "angry", talk: true }, { id: "chip", expr: "scared" }] },
    { t: seg("news2"), C: Protein, mood: "body", tint: TINT.bio, chip: S2, cast: [{ id: "lumi", expr: "happy", talk: true }, { id: "wattson", expr: "neutral" }] },
    { t: N2B, C: Binders, mood: "body", tint: TINT.bio, chip: S2, cast: [{ id: "lumi", expr: "surprised", talk: true }, { id: "wattson", expr: "confused" }] },
    { t: N2C, C: Replacement, mood: "body", tint: TINT.host, chip: S2, cast: [{ id: "wattson", expr: "angry", talk: true }, { id: "lumi", expr: "laugh" }] },
    { t: N3, C: Timelines, mood: "body", tint: TINT.pharma, chip: S3, cast: [{ id: "cloudy", expr: "happy", talk: true }, { id: "chip", expr: "surprised" }] },
    { t: N3B, C: NoMiracles, mood: "body", tint: TINT.pharma, chip: S3, cast: [{ id: "cloudy", expr: "sad", talk: true }, { id: "chip", expr: "confused" }] },
    { t: seg("loop"), C: ChargeMe, mood: "body", tint: TINT.hook, chip: "RECAP", cast: [{ id: "chip", expr: "happy" }, { id: "lumi", expr: "laugh" }, { id: "pixel", expr: "happy", talk: true }, { id: "cloudy", expr: "laugh" }, { id: "wattson", expr: "sad" }] },
    { t: word("loop", "now"), C: ChargeMe, mood: "body", tint: TINT.host, chip: "RECAP", cast: [{ id: "chip", expr: "laugh" }, { id: "lumi", expr: "laugh" }, { id: "wattson", expr: "sad", talk: true }, { id: "pixel", expr: "laugh" }, { id: "cloudy", expr: "laugh" }] },
  ],
};
