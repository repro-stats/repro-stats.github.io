# Bayesian prior elicitation for clinical trials: a practical guide with bayprior

**Date:** 22 Jun 2026
**Author:** Ndoh Penn
**Reading time:** ~8 min
**Tags:** Bayesian, bayprior, FDA 2026, Clinical trials

---

## Introduction

The FDA's 2026 draft guidance on Bayesian statistical methods for drug and biological products raises the bar for how sponsors justify and document their prior distributions. For teams using R, the `bayprior` package provides a structured workflow that takes you from expert elicitation through prior-data conflict diagnostics to a submission-ready justification report.

This guide walks through the core workflow with practical R code, using verified function signatures from the package documentation. We assume basic familiarity with Bayesian methods and a regulated environment where documentation matters.

---

## Why prior justification is now a regulatory concern

Bayesian methods have been used in clinical trials for years, but the FDA's 2026 guidance makes explicit what was previously implicit: the prior distribution is not just a statistical choice — it is a regulatory claim that requires documented justification, sensitivity analysis, and evidence that the prior does not unduly influence the posterior in ways that conflict with the trial data.

Specifically, the guidance asks sponsors to:

- Document the source and rationale for the prior (expert opinion, historical data, or literature)
- Assess prior-data conflict — whether the prior and the observed data are compatible
- Conduct sensitivity analyses showing how conclusions change under alternative priors
- Include this documentation in the SAP and the regulatory submission

`bayprior` is built to address each of these requirements systematically.

---

## Installation

```r
install.packages("bayprior")
library(bayprior)
```

An interactive Shiny application is also available:

```r
run_app()
```

---

## Step 1: Eliciting the prior

`bayprior` supports three elicitation methods: **moment matching**, **quantile matching**, and the **SHELF roulette method** — across six distribution families (Beta, Normal, Gamma, Log-Normal, Exponential, Weibull).

The most common scenario for a response rate is moment matching from an expert's central estimate and uncertainty:

```r
# Elicit a Beta prior on a response rate
# Expert believes: mean response ~35%, SD ~10%
prior <- elicit_beta(
  mean      = 0.35,
  sd        = 0.10,
  method    = "moments",
  label     = "Response rate",
  expert_id = "Expert_1"
)

plot(prior)
```

For multi-expert pooling, `bayprior` supports linear and logarithmic opinion pooling with Bhattacharyya agreement diagnostics:

```r
e1  <- elicit_beta(mean = 0.30, sd = 0.10, method = "moments", expert_id = "E1")
e2  <- elicit_beta(mean = 0.42, sd = 0.12, method = "moments", expert_id = "E2")

agg <- aggregate_experts(list(E1 = e1, E2 = e2), weights = c(0.6, 0.4))
```

---

## Step 2: Prior-data conflict diagnostics

Once trial data are available, `prior_conflict()` computes four complementary diagnostics: Box's prior predictive p-value, surprise index, Bhattacharyya overlap, and KL divergence. It supports binary, continuous, Poisson/count, and survival data types.

```r
# Observed data: 18 responders out of 40 patients (binary endpoint)
cd <- prior_conflict(
  prior,
  list(type = "binary", x = 18, n = 40)
)

print(cd)
```

Values of Box's p-value close to 0 or 1 indicate potential prior-data conflict — the data are surprising under the prior predictive distribution.

---

## Step 3: Sensitivity analysis

`sensitivity_grid()` evaluates posterior conclusions across a hyperparameter grid. Results are visualised with `plot_tornado()`:

```r
sa <- sensitivity_grid(
  prior,
  data_summary = list(type = "binary", x = 18, n = 40),
  param_grid   = list(alpha = seq(1, 8, 0.5), beta = seq(2, 20, 1)),
  target       = c("posterior_mean", "prob_efficacy"),
  threshold    = 0.30
)

plot_tornado(sa)
```

This demonstrates to regulators that conclusions are not uniquely dependent on the specific prior chosen.

---

## Step 4: Robust and sceptical priors

For regulatory sensitivity analyses, `bayprior` also implements robust mixture priors (Schmidli et al.) and sceptical priors (Spiegelhalter & Freedman):

```r
rob  <- robust_prior(prior, vague_weight = 0.20)
scep <- sceptical_prior(null_value = 0.20, family = "beta", strength = "moderate")
```

---

## Step 5: Generating the regulatory report

`prior_report()` generates a self-contained prior justification report in HTML, PDF, or Word format:

```r
prior_report(
  prior           = prior,
  conflict        = cd,
  sensitivity     = sa,
  robust_prior    = rob,
  sceptical_prior = scep,
  output_format   = "html",
  trial_name      = "TRIAL-001",
  sponsor         = "Example Pharma Ltd",
  author          = "N.P., Biostatistician"
)
```

Note: PDF output requires Quarto CLI and a LaTeX installation (`tinytex::install_tinytex()`).

---

## References

- O'Hagan, A. et al. (2006). *Uncertain Judgements: Eliciting Experts' Probabilities*. Wiley.
- Box, G. E. P. (1980). Sampling and Bayes' inference in scientific modelling and robustness. *JRSS-A*, 143, 383–430.
- Schmidli, H. et al. (2014). Robust meta-analytic-predictive priors in clinical trials. *Biometrics*, 70, 1023–1032.
- Spiegelhalter, D. J., Freedman, L. S. & Parmar, M. K. B. (1994). Bayesian approaches to randomized trials. *JRSS-A*, 157, 357–416.
- Ibrahim, J. G. & Chen, M.-H. (2000). Power prior distributions for regression models. *Statistical Science*, 15, 46–60.
- FDA (2026). *Draft Guidance: Bayesian Statistical Methods for Drug and Biological Products*.

---

*Questions or corrections: [penn@reprosia.com](mailto:penn@reprosia.com) or [open an issue on GitHub](https://github.com/repro-stats).*
