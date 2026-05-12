"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  default: () => index_default
});
module.exports = __toCommonJS(index_exports);
var TOS_INDICATOR = "\u26A0\uFE0F";
function checkMessageForViolations(content) {
  const violations = [];
  const lower = content.toLowerCase();
  if (/\b(nsfw|pornhub|onlyfans|hentai|nude|nudes)\b/.test(lower))
    violations.push("Possible NSFW content (Discord ToS)");
  if (/\b(nigger|nigga|faggot|tranny|chink|spic|kike)\b/.test(lower))
    violations.push("Slur / hate speech detected");
  if (/\b(malware|keylogger|stealer|token grabber)\b/.test(lower))
    violations.push("Malware reference");
  if (/\b(aimbot|esp|wallhack|triggerbot|byfron bypass)\b/.test(lower))
    violations.push("Cheat / exploit tool (server rule)");
  const rivals = ["synapse", "krnl", "fluxus", "arceus x", "scriptware", "solara", "xeno", "evon"];
  for (const t of rivals) {
    if (lower.includes(t)) {
      violations.push(`Competitor tool: "${t}"`);
      break;
    }
  }
  if (/(.)\1{6,}/.test(content)) violations.push("Spam / flooding");
  if (/\b(trump|biden|maga|election fraud)\b/.test(lower)) violations.push("Political topic (server rule)");
  if (/\b(partnership|partner with us)\b/.test(lower)) violations.push("Partnership solicitation (server rule)");
  if (/madium/.test(lower) && !/getmadium\.net/.test(lower) && /http/.test(lower)) violations.push("Unofficial Madium link");
  if (/\b(key system|linkvertise|work\.ink)\b/.test(lower)) violations.push("Key system script (server rule)");
  if (/\b(ban evad|mute evad|bypassing ban)\b/.test(lower)) violations.push("Ban / mute evasion");
  if (/\b(kys|kill your?self|go die)\b/.test(lower)) violations.push("Harassment (Discord ToS)");
  return violations;
}
var { findByProps } = vendetta.metro;
var { after } = vendetta.patcher;
var { React } = vendetta.metro.common;
function WarningBar({ violations, messageId }) {
  const [expanded, setExpanded] = React.useState(false);
  return React.createElement(
    "div",
    { style: { marginBottom: 2 } },
    React.createElement("button", {
      onClick: () => setExpanded((v) => !v),
      style: { background: "rgba(255,165,0,0.15)", borderLeft: "3px solid #FFA500", borderRadius: 4, padding: "3px 8px", marginTop: 2, cursor: "pointer", border: "none", color: "#FFA500", fontWeight: 600, fontSize: 12 }
    }, `${TOS_INDICATOR} ${violations.length} violation${violations.length > 1 ? "s" : ""} ${expanded ? "\u25B2" : "\u25BC"}`),
    expanded && React.createElement(
      "div",
      { style: { background: "rgba(255,165,0,0.08)", borderRadius: 4, padding: 6, marginTop: 2 } },
      ...violations.map((v, i) => React.createElement("div", { key: i, style: { fontSize: 11, color: "#FFB732", marginBottom: 2 } }, `\u2022 ${v}`))
    )
  );
}
var unpatch = null;
var index_default = {
  onLoad() {
    const mc = findByProps("ChannelMessage", "ThreadStarterChatMessage");
    if (!mc?.ChannelMessage) return;
    unpatch = after("ChannelMessage", mc, (args, res) => {
      const message = args?.[0]?.message ?? args?.[0]?.props?.message;
      if (!message?.content) return res;
      const violations = checkMessageForViolations(message.content);
      if (!violations.length) return res;
      if (res?.props?.children) {
        const orig = res.props.children;
        res.props.children = React.createElement(
          React.Fragment,
          null,
          React.createElement(WarningBar, { violations, messageId: message.id }),
          orig
        );
      }
      return res;
    });
  },
  onUnload() {
    unpatch?.();
    unpatch = null;
  }
};
