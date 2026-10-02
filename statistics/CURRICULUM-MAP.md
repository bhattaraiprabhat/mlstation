# MLStation Statistics Core — Curriculum Map

This 12-article path is designed as a bridge from first-principles statistics to practical Data Science, Machine Learning and AI.

| # | Article | Index coverage | Practical bridge | Dynamic element |
|---:|---|---|---|---|
| 1 | Descriptive Statistics: Data Have Shape | Descriptive Statistics | EDA, preprocessing, robust statistics | Outlier slider |
| 2 | Probability by Simulation | Probability | Monte Carlo, uncertainty, probabilistic predictions | LLN + π simulation |
| 3 | Random Variables & Distributions | Distributions | likelihoods, loss functions, target types | Binomial laboratory |
| 4 | Sampling, SE & CLT | Statistical Inference | uncertainty of metrics, repeated samples | animated sampling distribution |
| 5 | Estimation, CI & Bootstrap | Statistical Inference | uncertainty for ML metrics | repeated CI coverage + bootstrap |
| 6 | Hypothesis Tests & Power | Hypothesis Testing | model/feature comparisons | p-value tails + power animation |
| 7 | A/B Testing | Experimentation | online product/ML experiments | live experiment + lift animation |
| 8 | Correlation, Confounding & Causality | Foundations / Applied | feature relationships, causal caution | correlation cloud + Simpson simulation |
| 9 | Linear Regression | Regression | supervised learning, regularization | manual fit + 3D loss surface |
| 10 | Logistic Regression | Regression | classification, thresholds, calibration | sigmoid + threshold animation |
| 11 | Bayesian Statistics | Bayesian Methods | uncertainty, sequential learning | prior/posterior updater |
| 12 | Time Series & Forecasting | Time Series | leakage-safe forecasting | signal builder + rolling backtest |

## Coverage validation

The sequence covers every major area named in the supplied Statistics index:

- **Foundations:** descriptive statistics, probability, distributions.
- **Inference:** sampling/estimation, confidence intervals, hypothesis testing, regression, Bayesian methods.
- **Applied:** time series and experimentation/A/B testing.
- **Cross-cutting practical topics:** bootstrap, power/sample size, correlation vs causation, regularization, classification thresholds, calibration, leakage and reproducibility.

The existing **Normal Distribution, Interactively** article remains a focused distribution deep dive and fits naturally after Article 3 or as a linked companion inside it.

## Pedagogical spine

Every article follows the same broad learning rhythm without looking identical:

**question → intuition → mathematics → interactive manipulation → simulation → DS/ML bridge → failure mode → reproducibility → summary**

The simulations are intended to expose statistical behavior, not merely decorate the page.
