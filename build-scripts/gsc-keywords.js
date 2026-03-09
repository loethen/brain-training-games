/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SEARCH_ANALYTICS_URL = 'https://searchconsole.googleapis.com/webmasters/v3/sites';
const DEFAULT_DAYS = 28;
const DEFAULT_ROW_LIMIT = 500;
const DEFAULT_OUTPUT_DIR = path.join(process.cwd(), 'reports', 'seo');

function parseArgs(argv) {
  return argv.reduce((acc, arg) => {
    if (!arg.startsWith('--')) return acc;

    const [rawKey, rawValue] = arg.slice(2).split('=');
    acc[rawKey] = rawValue ?? 'true';
    return acc;
  }, {});
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing ${name}. Add it to .env.local before running this script.`
    );
  }

  return value;
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function shiftDate(date, days) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function getDateRange(days) {
  const yesterday = shiftDate(new Date(`${formatDate(new Date())}T00:00:00.000Z`), -1);
  const endDate = yesterday;
  const startDate = shiftDate(endDate, -(days - 1));
  const previousEndDate = shiftDate(startDate, -1);
  const previousStartDate = shiftDate(previousEndDate, -(days - 1));

  return {
    current: {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
    },
    previous: {
      startDate: formatDate(previousStartDate),
      endDate: formatDate(previousEndDate),
    },
  };
}

async function fetchAccessToken() {
  const clientId = requireEnv('GSC_CLIENT_ID');
  const clientSecret = requireEnv('GSC_CLIENT_SECRET');
  const refreshToken = requireEnv('GSC_REFRESH_TOKEN');

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Failed to refresh GSC access token: ${response.status} ${details}`);
  }

  const payload = await response.json();
  return payload.access_token;
}

async function fetchSearchAnalytics({
  accessToken,
  siteUrl,
  startDate,
  endDate,
  rowLimit,
  country,
  device,
}) {
  const dimensionFilterGroups = [];
  const filters = [];

  if (country) {
    filters.push({
      dimension: 'country',
      operator: 'equals',
      expression: country.toLowerCase(),
    });
  }

  if (device) {
    filters.push({
      dimension: 'device',
      operator: 'equals',
      expression: device.toLowerCase(),
    });
  }

  if (filters.length > 0) {
    dimensionFilterGroups.push({ filters });
  }

  const encodedSiteUrl = encodeURIComponent(siteUrl);
  const response = await fetch(
    `${SEARCH_ANALYTICS_URL}/${encodedSiteUrl}/searchAnalytics/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        startDate,
        endDate,
        type: 'web',
        dimensions: ['query', 'page'],
        rowLimit,
        dimensionFilterGroups,
      }),
    }
  );

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`GSC query failed for ${startDate}..${endDate}: ${response.status} ${details}`);
  }

  const payload = await response.json();
  return payload.rows ?? [];
}

function buildRowMap(rows) {
  const map = new Map();

  for (const row of rows) {
    const [query = '', page = ''] = row.keys ?? [];
    const key = `${query}|||${page}`;

    map.set(key, {
      query,
      page,
      clicks: row.clicks ?? 0,
      impressions: row.impressions ?? 0,
      ctr: row.ctr ?? 0,
      position: row.position ?? 0,
    });
  }

  return map;
}

function round(value, digits = 2) {
  return Number(value.toFixed(digits));
}

function mergeRows(currentRows, previousRows) {
  const currentMap = buildRowMap(currentRows);
  const previousMap = buildRowMap(previousRows);
  const keys = new Set([...currentMap.keys(), ...previousMap.keys()]);
  const merged = [];

  for (const key of keys) {
    const current = currentMap.get(key) ?? {
      query: '',
      page: '',
      clicks: 0,
      impressions: 0,
      ctr: 0,
      position: 0,
    };
    const previous = previousMap.get(key) ?? {
      query: current.query,
      page: current.page,
      clicks: 0,
      impressions: 0,
      ctr: 0,
      position: 0,
    };

    merged.push({
      query: current.query || previous.query,
      page: current.page || previous.page,
      clicks: round(current.clicks),
      impressions: round(current.impressions),
      ctr: round(current.ctr * 100, 2),
      position: round(current.position, 2),
      previousClicks: round(previous.clicks),
      previousImpressions: round(previous.impressions),
      previousCtr: round(previous.ctr * 100, 2),
      previousPosition: round(previous.position, 2),
      clickDelta: round(current.clicks - previous.clicks),
      impressionDelta: round(current.impressions - previous.impressions),
      ctrDelta: round((current.ctr - previous.ctr) * 100, 2),
      positionDelta: round(previous.position - current.position, 2),
    });
  }

  return merged.sort((a, b) => b.impressions - a.impressions);
}

function take(rows, predicate, limit = 15) {
  return rows.filter(predicate).slice(0, limit);
}

function summarizeByPage(rows) {
  const pageMap = new Map();

  for (const row of rows) {
    const existing = pageMap.get(row.page) ?? {
      page: row.page,
      clicks: 0,
      impressions: 0,
      previousClicks: 0,
      previousImpressions: 0,
      queryCount: 0,
    };

    existing.clicks += row.clicks;
    existing.impressions += row.impressions;
    existing.previousClicks += row.previousClicks;
    existing.previousImpressions += row.previousImpressions;
    existing.queryCount += 1;

    pageMap.set(row.page, existing);
  }

  return [...pageMap.values()]
    .map((row) => ({
      ...row,
      clickDelta: round(row.clicks - row.previousClicks),
      impressionDelta: round(row.impressions - row.previousImpressions),
    }))
    .sort((a, b) => b.impressions - a.impressions);
}

function buildReport(rows, pageSummary, meta) {
  const quickWins = take(
    rows,
    (row) =>
      row.impressions >= 80 &&
      row.position >= 3 &&
      row.position <= 15 &&
      row.ctr <= 3.5
  );

  const emergingQueries = take(
    rows,
    (row) =>
      row.impressions >= 40 &&
      row.previousImpressions <= 5 &&
      row.clicks <= 3
  );

  const decliningQueries = take(
    rows,
    (row) =>
      row.previousImpressions >= 40 &&
      row.impressionDelta <= -20
  );

  const pageOpportunities = take(
    pageSummary,
    (row) => row.impressions >= 100 && row.clickDelta <= 0
  );

  return {
    meta,
    totals: {
      rows: rows.length,
      currentClicks: round(rows.reduce((sum, row) => sum + row.clicks, 0)),
      currentImpressions: round(rows.reduce((sum, row) => sum + row.impressions, 0)),
      previousClicks: round(rows.reduce((sum, row) => sum + row.previousClicks, 0)),
      previousImpressions: round(rows.reduce((sum, row) => sum + row.previousImpressions, 0)),
    },
    quickWins,
    emergingQueries,
    decliningQueries,
    pageOpportunities,
    topRows: rows.slice(0, 50),
    topPages: pageSummary.slice(0, 25),
  };
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function csvEscape(value) {
  const text = String(value ?? '');
  if (text.includes('"') || text.includes(',') || text.includes('\n')) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
}

function rowsToCsv(rows) {
  if (rows.length === 0) return '';

  const headers = Object.keys(rows[0]);
  const lines = [headers.join(',')];

  for (const row of rows) {
    lines.push(headers.map((header) => csvEscape(row[header])).join(','));
  }

  return lines.join('\n');
}

function formatOpportunityLine(row, type = 'query') {
  if (type === 'page') {
    return `- ${row.page}: impressions ${row.impressions}, clicks ${row.clicks}, delta ${row.clickDelta}`;
  }

  return `- "${row.query}" -> ${row.page} | impressions ${row.impressions}, ctr ${row.ctr}%, position ${row.position}`;
}

function buildMarkdown(report) {
  const {
    meta,
    totals,
    quickWins,
    emergingQueries,
    decliningQueries,
    pageOpportunities,
  } = report;

  const lines = [
    '# GSC Keyword Opportunities',
    '',
    `- Site: ${meta.siteUrl}`,
    `- Current range: ${meta.current.startDate} to ${meta.current.endDate}`,
    `- Previous range: ${meta.previous.startDate} to ${meta.previous.endDate}`,
    `- Filter: country=${meta.country || 'all'}, device=${meta.device || 'all'}`,
    `- Compared rows: ${totals.rows}`,
    `- Current clicks/impressions: ${totals.currentClicks} / ${totals.currentImpressions}`,
    `- Previous clicks/impressions: ${totals.previousClicks} / ${totals.previousImpressions}`,
    '',
    '## Quick wins',
    quickWins.length > 0
      ? quickWins.map((row) => formatOpportunityLine(row)).join('\n')
      : '- No quick wins matched the current threshold.',
    '',
    '## Emerging queries',
    emergingQueries.length > 0
      ? emergingQueries.map((row) => formatOpportunityLine(row)).join('\n')
      : '- No emerging queries matched the current threshold.',
    '',
    '## Declining queries',
    decliningQueries.length > 0
      ? decliningQueries.map((row) => formatOpportunityLine(row)).join('\n')
      : '- No declining queries matched the current threshold.',
    '',
    '## Page opportunities',
    pageOpportunities.length > 0
      ? pageOpportunities.map((row) => formatOpportunityLine(row, 'page')).join('\n')
      : '- No page-level opportunities matched the current threshold.',
    '',
    '## Next actions',
    '- Refresh titles and meta descriptions for the quick-win rows first.',
    '- Turn the emerging queries into article or hub-page candidates.',
    '- Review the declining queries for ranking loss, cannibalization, or stale content.',
  ];

  return lines.join('\n');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const days = Number(args.days || process.env.GSC_LOOKBACK_DAYS || DEFAULT_DAYS);
  const rowLimit = Number(args.limit || process.env.GSC_ROW_LIMIT || DEFAULT_ROW_LIMIT);
  const country = args.country || process.env.GSC_COUNTRY || '';
  const device = args.device || process.env.GSC_DEVICE || '';
  const outputDir = path.resolve(
    args.outputDir || process.env.GSC_OUTPUT_DIR || DEFAULT_OUTPUT_DIR
  );
  const siteUrl = requireEnv('GSC_SITE_URL');

  if (!Number.isFinite(days) || days <= 0) {
    throw new Error(`Invalid days value: ${days}`);
  }

  if (!Number.isFinite(rowLimit) || rowLimit <= 0 || rowLimit > 25000) {
    throw new Error(`Invalid limit value: ${rowLimit}. Search Console API supports 1-25000.`);
  }

  const ranges = getDateRange(days);
  const accessToken = await fetchAccessToken();

  const [currentRows, previousRows] = await Promise.all([
    fetchSearchAnalytics({
      accessToken,
      siteUrl,
      startDate: ranges.current.startDate,
      endDate: ranges.current.endDate,
      rowLimit,
      country,
      device,
    }),
    fetchSearchAnalytics({
      accessToken,
      siteUrl,
      startDate: ranges.previous.startDate,
      endDate: ranges.previous.endDate,
      rowLimit,
      country,
      device,
    }),
  ]);

  const mergedRows = mergeRows(currentRows, previousRows);
  const pageSummary = summarizeByPage(mergedRows);
  const report = buildReport(mergedRows, pageSummary, {
    siteUrl,
    current: ranges.current,
    previous: ranges.previous,
    country,
    device,
    generatedAt: new Date().toISOString(),
  });

  ensureDir(outputDir);

  const suffix = [
    ranges.current.startDate,
    ranges.current.endDate,
    country || 'all',
    device || 'all',
  ].join('_');

  const jsonPath = path.join(outputDir, `gsc-keywords_${suffix}.json`);
  const csvPath = path.join(outputDir, `gsc-keywords_${suffix}.csv`);
  const mdPath = path.join(outputDir, `gsc-keywords_${suffix}.md`);

  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));
  fs.writeFileSync(csvPath, rowsToCsv(mergedRows));
  fs.writeFileSync(mdPath, buildMarkdown(report));

  console.log(`Saved JSON report to ${jsonPath}`);
  console.log(`Saved CSV report to ${csvPath}`);
  console.log(`Saved Markdown summary to ${mdPath}`);
}

main().catch((error) => {
  const details = [
    error.message,
    error.code ? `code=${error.code}` : '',
    error.errno ? `errno=${error.errno}` : '',
    error.type ? `type=${error.type}` : '',
    error.cause?.message ? `cause=${error.cause.message}` : '',
    error.cause?.code ? `causeCode=${error.cause.code}` : '',
  ]
    .filter(Boolean)
    .join(' | ');

  console.error(`GSC keyword mining failed: ${details}`);
  process.exitCode = 1;
});
