const ACTION_PADDING_Y = 12;
const ACTION_PADDING_X = 18;
const ACTION_BACKGROUND = "#111827";
const ACTION_TEXT_COLOR = "#ffffff";
const BODY_TEXT_COLOR = "#111827";
const BODY_MAX_WIDTH = 640;
const BODY_PADDING = 24;
const FOOTER_TEXT_COLOR = "#6b7280";
const FOOTER_TEXT_SIZE = 14;
const LOGO_SIZE = 64;

export const HEADER_STYLE = [
  "text-align:center",
  "padding:0 0 24px",
  "margin:0 0 24px",
  "border-bottom:1px solid #e5e7eb"
].join(";");

export const ACTION_STYLE = [
  "display:inline-block",
  `padding:${ACTION_PADDING_Y}px ${ACTION_PADDING_X}px`,
  `background:${ACTION_BACKGROUND}`,
  `color:${ACTION_TEXT_COLOR}`,
  "text-decoration:none",
  "border-radius:8px"
].join(";");

export const BODY_STYLE = [
  "font-family:Arial,sans-serif",
  "line-height:1.6",
  `color:${BODY_TEXT_COLOR}`,
  `max-width:${BODY_MAX_WIDTH}px`,
  "margin:0 auto",
  `padding:${BODY_PADDING}px`
].join(";");

export const LOGO_STYLE = [
  "display:block",
  "margin:0 auto",
  `width:${LOGO_SIZE}px`,
  `height:${LOGO_SIZE}px`,
  "object-fit:contain",
  "border:0",
  "outline:none",
  "text-decoration:none"
].join(";");

export const TITLE_STYLE = [
  "font-family:Arial,sans-serif",
  "font-size:20px",
  "line-height:28px",
  "font-weight:700",
  "color:#111827",
  "margin:0 0 16px"
].join(";");

export const MESSAGE_STYLE = [
  "font-family:Arial,sans-serif",
  "font-size:16px",
  "line-height:24px",
  "color:#374151",
  "margin:0 0 24px"
].join(";");

export const FOOTER_STYLE = [`color:${FOOTER_TEXT_COLOR}`, `font-size:${FOOTER_TEXT_SIZE}px`].join(";");
