# Contributing

[fork]: https://github.com/github/octocanvas/fork
[pr]: https://github.com/github/octocanvas/compare
[design]: https://github.com/github/octocanvas/blob/main/DESIGN_SYSTEM.md
[spec]: https://github.com/github/octocanvas/blob/main/SPEC.md
[license]: https://github.com/github/octocanvas/blob/main/LICENSE
[guidelines]: https://docs.github.com/en/site-policy/github-terms/github-community-guidelines

Hi there! We’re thrilled that you’d like to contribute to OctoCanvas. Your help is essential for keeping it great.

Contributions to this project are released to the public under the project’s open source license ([MIT][license]).

Please note that participation in this project is expected to follow the [GitHub Community Guidelines][guidelines]. By contributing, you agree to uphold these standards.

## Development setup

- Node.js 18+ and npm
- Git

Install dependencies:

```bash
npm install
```

Run the development server (Astro):

```bash
npm run dev
```

Build the production site:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Testing

This repo uses Playwright for basic health checks.

First-time setup (downloads browsers):

```bash
npx playwright install --with-deps
```

Run all tests:

```bash
npx playwright test
```

Run a specific test file (example):

```bash
npx playwright test tests/health.spec.ts
```

Add tests alongside your changes where it makes sense (e2e or smoke tests are welcome for new UI flows or regressions).

## Style and design guidelines

OctoCanvas follows GitHub’s visual aesthetic and project conventions. Please review:

- Project design system and theme details: [DESIGN_SYSTEM.md][design]
- Functional specification and feature behavior: [SPEC.md][spec]
- Tailwind configuration and color palette: `tailwind.config.mjs`

Additional conventions for this project:

- Tech stack: Astro, Preact, TypeScript, Tailwind CSS.
- Keep wallpapers’ exported assets static (no animation classes in downloads) while allowing animations in previews.
- For html2canvas captures (e.g., Devémon cards), prefer inline styles for reliable rendering.
- Respect the base path configuration in `astro.config.mjs` (default: `/octocanvas`).
- Use accessible color contrast and the GitHub Universe/Primer palettes as documented.

## Submitting a pull request

1. [Fork][fork] and clone the repository.
2. Create a new branch for your change:
   ```bash
   git checkout -b my-feature-branch
   ```
3. Make your changes.
4. If applicable, add or update tests and verify they pass locally:
   ```bash
   npx playwright test
   ```
5. Ensure the app still builds:
   ```bash
   npm run build
   ```
6. Commit with a clear, descriptive message.
7. Push to your fork and open a [pull request][pr].

Here are a few things that increase the likelihood of your pull request being accepted:

- Align with the documented behavior in [SPEC][spec] and visuals in [DESIGN_SYSTEM][design].
- Keep changes focused and incremental. If you have multiple unrelated improvements, prefer separate PRs.
- Add tests for new user-facing flows or to cover fixed regressions.
- Include a brief description explaining the why and the how, plus before/after screenshots or GIFs for UI changes.
- Write a good commit message (e.g., imperative mood, concise subject, optional body for context).

## Branches and releases

- The `main` branch is the default and may be deployed to GitHub Pages when configured.
- Use feature branches for contributions (e.g., `feat/readme-banner`, `fix/card-export`).

## Reporting issues and asking questions

- If you find a bug or want to propose an enhancement, please open an issue with clear reproduction steps, expected behavior, and environment details.
- For questions, include screenshots or short clips if the topic is UI-related.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License][license].
