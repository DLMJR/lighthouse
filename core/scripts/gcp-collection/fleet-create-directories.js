/**
 * @license Copyright 2020 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

/**
 * @fileoverview This script splits a large URL list into chunks and creates a copy of the GCP
 * collection scripts for each instance that will run it.
 *
 * USAGE: node core/scripts/gcp-collection/fleet-create-directories.js [<url list file>]
 */

import fs from 'fs';
import path from 'path';

import {LH_ROOT} from '../../../shared/root.js';

const TMP_DIR = path.join(LH_ROOT, '.tmp/gcp-instances');
const URLS_LIST = process.argv[2]
  ? path.resolve(process.cwd(), process.argv[2])
  : path.join(LH_ROOT, 'core/scripts/gcp-collection/urls.txt');

fs.rmSync(TMP_DIR, {recursive: true, force: true});
fs.mkdirSync(TMP_DIR);

const MACHINE_BASE_INDEX = 0;
const URL_START_INDEX = 0;
const URLS_PER_MACHINE = 100;

const allUrls = fs
  .readFileSync(URLS_LIST, 'utf8')
  .split('\n')
  .filter(line => line && line.startsWith('http'))
  .slice(URL_START_INDEX);

const parallelism = Math.ceil(allUrls.length / URLS_PER_MACHINE);
/** @type {Array<Array<string>>} */
const instanceUrls = Array.from({length: parallelism}).map(() => []);
allUrls.forEach((url, index) => instanceUrls[index % parallelism].push(url));

instanceUrls.forEach((urls, i) => {
  if (!urls.length) return;

  const dir = path.join(TMP_DIR, `instance${MACHINE_BASE_INDEX + i}`);
  fs.mkdirSync(dir);
  const scriptDir = `${LH_ROOT}/core/scripts/gcp-collection`;
  const files = fs.readdirSync(scriptDir).filter(f => f.endsWith('.sh'));
  files.forEach(f =>
    fs.copyFileSync(path.join(scriptDir, f), path.join(dir, f))
  );
  fs.writeFileSync(path.join(dir, 'urls.txt'), urls.join('\n'));
});
