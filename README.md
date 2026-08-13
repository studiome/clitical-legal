# CLiTICAL Legal

Public legal documents and support information for CLiTICAL, maintained in Japanese and English.

## Public URLs

- Japanese Privacy Policy: <https://studiome.github.io/clitical-legal/privacy/ja/>
- English Privacy Policy: <https://studiome.github.io/clitical-legal/privacy/en/>
- Japanese Terms: <https://studiome.github.io/clitical-legal/terms/ja/>
- English Terms: <https://studiome.github.io/clitical-legal/terms/en/>
- Support: <https://studiome.github.io/clitical-legal/support/en/>

The site is static HTML. It requires no login, JavaScript, cookies, or editable document service.

## Verification

Run the local content tests:

```sh
node --test tests/legal-site.test.mjs
```

After deployment, verify direct public access with normal and Googlebot user agents:

```sh
bash scripts/verify-public-site.sh
```

GitHub Actions deploys `site/` to GitHub Pages after the tests pass on `main`. A scheduled workflow checks all public document URLs daily.

## Updating legal documents

Keep Japanese and English versions aligned, update the `<time>` value and visible revision date, then run the tests. Do not add authentication, geo-restrictions, PDF-only policies, `noindex`, or forms that require login.

Legal text is published for CLiTICAL. No license is granted for reuse of the legal text, names, or marks except as required by applicable law.
