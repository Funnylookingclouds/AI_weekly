import React from "react";
import { Composition, Still } from "remotion";
import { WeeklyShort, DURATION } from "./WeeklyShort";
import { FPS } from "./timing";
import * as B from "./brand/Brand";
import { PresenterProto, PROTO_LEN } from "./proto/Presenter";
import { JokeProto, JOKE_LEN } from "./proto/Joke";
import { HockeyMascots } from "./proto/HockeyMascot";

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
    <Still id="HockeyMascots" component={HockeyMascots} width={1080} height={1240} />
    <Still id="LogoSquare" component={B.LogoSquare} width={1080} height={1080} />
    <Still id="LogoAvatar" component={B.LogoAvatar} width={800} height={800} />
  </>
);
