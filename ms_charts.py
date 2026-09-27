"""
MLStation chart style: one import, consistent charts in light AND dark mode.

    from ms_charts import COLORS, SEQ, style_matplotlib, plotly_template
    style_matplotlib()                 # before any matplotlib figure
    fig.update_layout(template="mlstation")   # for Plotly (registered on import)

Why it works in both themes: backgrounds are transparent and text/grid use a
mid-grey that stays readable on white and on near-black.
"""
import matplotlib as mpl

# ---- Palette (matches the site accent and section colors) -------------------
COLORS = {
    "indigo": "#6366F1",   # primary series
    "violet": "#A855F7",
    "teal":   "#14B8A6",
    "amber":  "#F59E0B",
    "rose":   "#F43F5E",
    "slate":  "#64748B",
}
SEQ = ["#6366F1", "#14B8A6", "#F59E0B", "#F43F5E", "#A855F7", "#64748B"]   # categorical order
SURFACE_SCALE = ["#14B8A6", "#6366F1", "#A855F7"]   # vivid, readable on light and dark
INDIGO_SCALE = ["#EEF2FF", "#C7D2FE", "#A5B4FC", "#818CF8", "#6366F1", "#4F46E5", "#3730A3"]

TEXT = "#8A93A3"                 # readable on light and dark
GRID = "rgba(138,147,163,0.18)"
FONT = "Inter, system-ui, -apple-system, Segoe UI, sans-serif"


# ---- Matplotlib -------------------------------------------------------------
def style_matplotlib():
    mpl.rcParams.update({
        "figure.facecolor": "none", "axes.facecolor": "none", "savefig.transparent": True,
        "figure.figsize": (7, 3.6), "figure.dpi": 110, "savefig.dpi": 200,
        "font.family": "sans-serif",
        "font.sans-serif": ["Inter", "Helvetica Neue", "Arial", "DejaVu Sans"],
        "font.size": 10.5, "axes.titlesize": 12, "axes.titleweight": "semibold",
        "axes.titlelocation": "left", "axes.labelsize": 10.5,
        "text.color": TEXT, "axes.labelcolor": TEXT, "xtick.color": TEXT, "ytick.color": TEXT,
        "axes.edgecolor": TEXT, "axes.linewidth": 0.8,
        "axes.spines.top": False, "axes.spines.right": False,
        "axes.grid": True, "grid.color": "#8A93A3", "grid.alpha": 0.18, "grid.linewidth": 0.8,
        "axes.prop_cycle": mpl.cycler(color=SEQ),
        "lines.linewidth": 2.2, "lines.solid_capstyle": "round",
        "legend.frameon": False, "legend.fontsize": 9.5,
        "xtick.major.size": 0, "ytick.major.size": 0,
    })


# ---- Plotly -----------------------------------------------------------------
def plotly_template():
    import plotly.graph_objects as go
    import plotly.io as pio
    t = go.layout.Template()
    t.layout = go.Layout(
        font=dict(family=FONT, size=13, color=TEXT),
        paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)",
        colorway=SEQ,
        margin=dict(l=48, r=16, t=40, b=44),
        title=dict(x=0, xanchor="left", font=dict(size=15)),
        xaxis=dict(gridcolor=GRID, zeroline=False, linecolor=GRID, ticks="", title_standoff=10),
        yaxis=dict(gridcolor=GRID, zeroline=False, linecolor=GRID, ticks="", title_standoff=10),
        legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="left", x=0, bgcolor="rgba(0,0,0,0)"),
        hoverlabel=dict(font=dict(family=FONT, size=12), bordercolor="rgba(0,0,0,0)"),
        colorscale=dict(sequential=[[i / 6, c] for i, c in enumerate(INDIGO_SCALE)]),
    )
    pio.templates["mlstation"] = t
    pio.templates.default = "mlstation"
    return t


PLOTLY_CONFIG = {"displaylogo": False, "responsive": True,
                 "modeBarButtonsToRemove": ["lasso2d", "select2d", "autoScale2d"]}

try:                      # register the Plotly template automatically when plotly is installed
    plotly_template()
except ImportError:
    pass
