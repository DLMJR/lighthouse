#!/usr/bin/env node
/**
 * @license Copyright 2018 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

/* eslint-disable no-console */

import fs from 'fs';
import path from 'path';
import {execFileSync} from 'child_process';

import prettyJSONStringify from 'pretty-json-stringify';

import constants from './constants.js';
import {LH_ROOT} from '../../../shared/root.js';
import {readJson} from '../../test/test-utils.js';

const INPUT_PATH = process.argv[2] || constants.SITE_INDEX_WITH_GOLDEN_PATH;
const SITE_INDEX_PATH = path.resolve(process.cwd(), INPUT_PATH);
const HEAD_COMPUTED_PATH = constants.SITE_INDEX_WITH_GOLDEN_WITH_COMPUTED_PATH;
const RUN_ALL_SCRIPT_PATH =
  path.join(LH_ROOT, 'core/scripts/lantern/run-on-all-assets.js');
const OUTPUT_PATH = constants.BASELINE_COMPUTED_PATH;
const OUTPUT_ACCURACY_PATH = constants.BASELINE_ACCURACY_PATH;

if (!fs.existsSync(HEAD_COMPUTED_PATH) || process.env.FORCE) {
  if (!fs.existsSync(SITE_INDEX_PATH)) throw new Error('Usage $0 <expectations file>');
  execFileSync(RUN_ALL_SCRIPT_PATH, [SITE_INDEX_PATH]);
}

const computedResults = readJson(HEAD_COMPUTED_PATH);

const sites = [];
for (const entry of computedResults.sites) {
  const lanternValues = entry.lantern;
  Object.keys(lanternValues).forEach(key => lanternValues[key] = Math.round(lanternValues[key]));
  sites.push({url: entry.url, ...lanternValues});
}

fs.writeFileSync(OUTPUT_PATH, prettyJSONStringify({sites}, {
  tab: '  ',
  spaceBeforeColon: '',
  spaceInsideObject: '',
  shouldExpand: (_, level) => level < 2,
}) + '\n');

fs.writeFileSync(OUTPUT_ACCURACY_PATH, JSON.stringify(
  constants.evaluateAllMetrics(computedResults, {sites}),
  null,
  2
) + '\n');
