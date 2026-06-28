import type { CommandResult, Effect } from "../types";
import TextRenderer from "./TextRenderer";
import AsciiRenderer from "./AsciiRenderer";
import TableRenderer from "./TableRenderer";
import ProjectsRenderer from "./ProjectsRenderer";
import ListRenderer from "./ListRenderer";
import TimelineRenderer from "./TimelineRenderer";
import CertsRenderer from "./CertsRenderer";
import SocialsRenderer from "./SocialsRenderer";
import EmailRenderer from "./EmailRenderer";
import ThemesRenderer from "./ThemesRenderer";
import ScanRenderer from "./ScanRenderer";
import NowRenderer from "./NowRenderer";
import PgpRenderer from "./PgpRenderer";
import UsesRenderer from "./UsesRenderer";
import FortuneRenderer from "./FortuneRenderer";
import FlagRenderer from "./FlagRenderer";
import HofRenderer from "./HofRenderer";
import MotdRenderer from "./MotdRenderer";
import ResumeRenderer from "./ResumeRenderer";
import SoundRenderer from "./SoundRenderer";

// Maps a result's output_type to its renderer. New output types only need a
// renderer here plus a corresponding output_type in portfolio.json.
export function renderResult(
  result: CommandResult,
  onEffect: (effect: Effect) => void
) {
  switch (result.type) {
    case "empty":
      return null;
    case "welcome":
      return <AsciiRenderer result={result} />;
    case "table":
      return <TableRenderer result={result} />;
    case "projects":
      return <ProjectsRenderer result={result} />;
    case "list":
      return <ListRenderer result={result} />;
    case "timeline":
      return <TimelineRenderer result={result} />;
    case "certs":
      return <CertsRenderer result={result} />;
    case "socials":
      return <SocialsRenderer result={result} />;
    case "email":
      return <EmailRenderer result={result} />;
    case "themes":
      return <ThemesRenderer result={result} />;
    case "scan":
    case "sudo":
      return <ScanRenderer result={result} onEffect={onEffect} />;
    case "now":
      return <NowRenderer />;
    case "pgp":
      return <PgpRenderer />;
    case "uses":
      return <UsesRenderer />;
    case "fortune":
      return <FortuneRenderer result={result} />;
    case "flag_submit":
      return <FlagRenderer result={result} />;
    case "hof":
      return <HofRenderer result={result} />;
    case "motd":
      return <MotdRenderer result={result} />;
    case "resume":
      return <ResumeRenderer result={result} />;
    case "sound_on":
    case "sound_off":
      return <SoundRenderer result={result} />;
    case "text":
    case "help":
    default:
      // text, help, and any unknown type fall back to plain line output.
      return <TextRenderer result={result} />;
  }
}
