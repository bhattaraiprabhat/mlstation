// MLStation · shared style for Observable Plot charts (used inside ```{ojs} cells)
export const ms = {
  indigo: "#6366F1", violet: "#A855F7", teal: "#14B8A6",
  amber: "#F59E0B", rose: "#F43F5E", slate: "#64748B",
  seq: ["#6366F1", "#14B8A6", "#F59E0B", "#F43F5E", "#A855F7", "#64748B"]
};
export const msStyle = {
  height: 320,
  marginLeft: 48, marginBottom: 40,
  style: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "12.5px",
    background: "transparent",
    color: "currentColor",
    overflow: "visible"
  },
  grid: true,
  color: { range: ms.seq }
};
