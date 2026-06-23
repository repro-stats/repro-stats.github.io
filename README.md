# ReproStats

**Open-source R infrastructure for rigorous pharmaceutical data science.**

ReproStats is a collection of R packages designed for statisticians and programmers working in regulated environments — pharma, biotech, and clinical research organisations operating under FDA, EMA, and ICH requirements.

## Packages

### On CRAN

| Package | Version | Description |
|---------|---------|-------------|
| [reproducr](https://github.com/repro-stats/reproducr) | 0.2.1 | Script audit, environment certification, risk scoring, and drift detection for 21 CFR Part 11-aligned R analyses |
| [bayprior](https://ndohpenngit.github.io/bayprior/) | 0.1.0 | Bayesian prior elicitation, conflict diagnostics, sensitivity analysis, and regulatory reporting — aligned with FDA 2026 draft guidance |

### In development

| Package | Description |
|---------|-------------|
| [regulog](https://github.com/repro-stats/regulog) | Tamper-evident, user-attributed electronic audit logging for R — designed around 21 CFR Part 11 |
| [lineager](https://github.com/repro-stats/lineager) | Row-level data provenance for clinical datasets — full traceability from SDTM to ADaM |
| [estimandr](https://github.com/repro-stats/estimandr) | ICH E9(R1) estimand framework for R — define, document, and implement estimand strategies in your analysis pipeline |

## Installation

```r
# Packages on CRAN
install.packages("reproducr")
install.packages("bayprior")

# Development packages
remotes::install_github("repro-stats/regulog")
remotes::install_github("repro-stats/lineager")
remotes::install_github("repro-stats/estimandr")
```

## Documentation

- Full package documentation, vignettes, and articles: [reprostats.org](https://reprostats.org)
- bayprior pkgdown site: [ndohpenngit.github.io/bayprior](https://ndohpenngit.github.io/bayprior/)
- Blog — practical guides for R in regulated settings: [reprostats.org/blog](https://reprostats.org/blog.html)

## Contributing

Contributions are welcome. To report a bug or request a feature, open an issue in the relevant package repository. For general questions or discussion, open an issue here or reach out at [penn@reprosia.com](mailto:penn@reprosia.com).

When contributing code:
- Follow the existing code style
- Add tests for new functionality
- Update documentation where relevant
- Ensure `R CMD check` passes with no errors or warnings

## Related

[**Reprosia**](https://reprosia.com) is the enterprise platform built on the ReproStats open-source foundation — adding AI-assisted IQ/OQ/PQ validation, environment management, and regulatory submission tooling for pharma and biotech teams.

## Author

**Ndoh Penn** — Biostatistician, Brussels, Belgium  
[penn@reprosia.com](mailto:penn@reprosia.com) · [reprosia.com](https://reprosia.com)

## License

Each package is licensed individually. See the `LICENSE` file in each repository.