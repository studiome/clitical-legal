import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const root = new URL('../site/', import.meta.url).pathname;
const pages = [
  ['index.html', 'ja'],
  ['privacy/ja/index.html', 'ja'],
  ['privacy/en/index.html', 'en'],
  ['terms/ja/index.html', 'ja'],
  ['terms/en/index.html', 'en'],
  ['support/ja/index.html', 'ja'],
  ['support/en/index.html', 'en'],
];

const read = (path) => readFileSync(join(root, path), 'utf8');

test('all public pages exist and contain required metadata', () => {
  for (const [path, lang] of pages) {
    assert.ok(existsSync(join(root, path)), `${path} must exist`);
    const html = read(path);
    assert.match(html, new RegExp(`<html lang="${lang}">`));
    assert.match(html, /<title>[^<]+CLiTICAL[^<]*<\/title>|<title>CLiTICAL[^<]*<\/title>/);
    assert.match(html, /<h1>[^<]+<\/h1>/);
    assert.match(html, /<meta name="viewport"/);
    assert.doesNotMatch(html, /TBD|TODO|example\.com|\[運営主体|\[Official/i);
    assert.doesNotMatch(html, /<form|type="password"|noindex/i);
  }
});

test('privacy policies describe current data handling and required contacts', () => {
  const ja = read('privacy/ja/index.html');
  const en = read('privacy/en/index.html');
  for (const html of [ja, en]) {
    assert.match(html, /特定非営利活動法人 日本血管外科学会|Japanese Society for Vascular Surgery/);
    assert.match(html, /office@jsvs\.org/);
    assert.match(html, /2026-08-13/);
    assert.match(html, /削除|delet/i);
    assert.match(html, /保存|retention|retain/i);
    assert.match(html, /第三者|third part/i);
    assert.match(html, /端末内|on the user's device/i);
  }
});

test('terms contain medical limitations and professional consultation notice', () => {
  const ja = read('terms/ja/index.html');
  const en = read('terms/en/index.html');
  assert.match(ja, /診断、治療、予防/);
  assert.match(ja, /医療従事者/);
  assert.match(en, /diagnosis, treatment, or prevention/i);
  assert.match(en, /healthcare professional/i);
});

test('Japanese pages display dates in Japanese format', () => {
  assert.match(
    read('privacy/ja/index.html'),
    /<time datetime="2026-08-13">最終改定日：2026年8月13日<\/time>/,
  );
  assert.match(
    read('terms/ja/index.html'),
    /<time datetime="2026-08-13">最終改定日：2026年8月13日<\/time>/,
  );
  assert.match(
    read('support/ja/index.html'),
    /<time datetime="2026-08-13">最終更新日：2026年8月13日<\/time>/,
  );
});

test('robots, sitemap, and static hosting marker exist', () => {
  assert.equal(read('robots.txt').trim().startsWith('User-agent: *'), true);
  assert.match(read('robots.txt'), /Allow: \//);
  assert.match(read('sitemap.xml'), /privacy\/ja\//);
  assert.ok(existsSync(join(root, '.nojekyll')));
});
