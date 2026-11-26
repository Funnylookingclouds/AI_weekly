import React from "react";
import { Composition, Still } from "remotion";
import { WeeklyShort, DURATION } from "./WeeklyShort";
import { FPS } from "./timing";
import * as B from "./brand/Brand";
import { PresenterProto, PROTO_LEN } from "./proto/Presenter";
import { JokeProto, JOKE_LEN } from "./proto/Joke";
import { HockeyMascots } from "./proto/HockeyMascot";
import { CastSheet, CastTurn, CastLoop } from "./cast/Sheet";
import { CastDemo, CAST_DEMO_LEN } from "./cast/Demo";
import { FlatpackSheet } from "./flatpack/Sheet";
import { FlatpackPilot, PILOT_LEN } from "./flatpack/Pilot";
import { FlatpackAudition, AUDITION_LEN } from "./flatpack/Audition";
import { FlatpackEp2, EP2_LEN } from "./flatpack/episodes/ep2";
import { FlatpackEp3, EP3_LEN } from "./flatpack/episodes/ep3";
import { FlatpackEp4, EP4_LEN } from "./flatpack/episodes/ep4";
import { FlatpackEp5, EP5_LEN } from "./flatpack/episodes/ep5";
import { FlatpackEp6, EP6_LEN } from "./flatpack/episodes/ep6";
import { FlatpackEp7, EP7_LEN } from "./flatpack/episodes/ep7";

const V = { fps: FPS, width: 1080, height: 1920 } as const;

export const Root: React.FC = () => (
  <>
    <Composition id="WeeklyShort" component={WeeklyShort} durationInFrames={DURATION} {...V} />
    {/* brand proposals (3 s each) */}
    <Composition id="IntroHyperbounce" component={B.IntroHyperbounce} durationInFrames={B.SEG} {...V} />
    <Composition id="IntroWarp" component={B.IntroWarp} durationInFrames={B.INTRO_SEG} {...V} />
    <Composition id="IntroOffTheCharts" component={B.IntroOffTheCharts} durationInFrames={B.SEG} {...V} />
    <Composition id="OutroSmash" component={B.OutroSmash} durationInFrames={B.SEG} {...V} />
    <Composition id="OutroLoading" component={B.OutroLoading} durationInFrames={B.SEG} {...V} />
    <Composition id="OutroKaraoke" component={B.OutroKaraoke} durationInFrames={B.SEG} {...V} />
    <Composition id="ProposalsReel" component={B.ProposalsReel} durationInFrames={B.REEL_LEN} {...V} />
    <Composition id="PresenterProto" component={PresenterProto} durationInFrames={PROTO_LEN} {...V} />
    <Composition id="JokeProto" component={JokeProto} durationInFrames={JOKE_LEN} {...V} />
    <Still id="HockeyMascots" component={HockeyMascots} width={1080} height={720} />
    <Still id="CastSheet" component={CastSheet} width={2600} height={1500} />
    <Still id="CastTurn" component={CastTurn} width={1600} height={1450} />
    <Composition id="CastDemo" component={CastDemo} durationInFrames={CAST_DEMO_LEN} {...V} />
    <Composition id="CastLoop" component={CastLoop} durationInFrames={450} {...V} />
    <Composition id="FlatpackPilot" component={FlatpackPilot} durationInFrames={PILOT_LEN} fps={60} width={1080} height={1920} />
    <Composition id="FlatpackAudition" component={FlatpackAudition} durationInFrames={AUDITION_LEN} fps={60} width={1080} height={1920} />
    <Composition id="FlatpackEp2" component={FlatpackEp2} durationInFrames={EP2_LEN} fps={60} width={1080} height={1920} />
    <Composition id="FlatpackEp3" component={FlatpackEp3} durationInFrames={EP3_LEN} fps={60} width={1080} height={1920} />
    <Composition id="FlatpackEp4" component={FlatpackEp4} durationInFrames={EP4_LEN} fps={60} width={1080} height={1920} />
    <Composition id="FlatpackEp5" component={FlatpackEp5} durationInFrames={EP5_LEN} fps={60} width={1080} height={1920} />
    <Composition id="FlatpackEp6" component={FlatpackEp6} durationInFrames={EP6_LEN} fps={60} width={1080} height={1920} />
    <Composition id="FlatpackEp7" component={FlatpackEp7} durationInFrames={EP7_LEN} fps={60} width={1080} height={1920} />
    <Still id="FlatpackSheet" component={FlatpackSheet} width={3560} height={2120} />
    <Still id="LogoSquare" component={B.LogoSquare} width={1080} height={1080} />
    <Still id="LogoAvatar" component={B.LogoAvatar} width={800} height={800} />
  </>
);
