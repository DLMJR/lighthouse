/**
 * @license Copyright 2019 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import FRGatherer from '../base-gatherer.js';
import DevtoolsLog from './devtools-log.js';
import Trace from './trace.js';
import {fetchResponseBodyFromCache} from '../driver/network.js';
import {MainResource} from '../../computed/main-resource.js';

/**
 * Collects the content of the main html document.
 */
class MainDocumentContent extends FRGatherer {
  /** @type {LH.Gatherer.GathererMeta<'DevtoolsLog'|'Trace'>} */
  meta = {
    supportedModes: ['navigation'],
    dependencies: {DevtoolsLog: DevtoolsLog.symbol, Trace: Trace.symbol},
  };

  /**
   * @param {LH.Gatherer.FRTransitionalContext} context
   * @param {LH.Artifacts['DevtoolsLog']} devtoolsLog
   * @param {LH.Artifacts['Trace']} trace
   * @return {Promise<LH.Artifacts['MainDocumentContent']>}
   */
  async _getArtifact(context, devtoolsLog, trace) {
    const mainResource =
      await MainResource.request({devtoolsLog, trace}, context);
    const session = context.driver.defaultSession;
    return fetchResponseBodyFromCache(session, mainResource.requestId);
  }

  /**
   * @param {LH.Gatherer.FRTransitionalContext<'DevtoolsLog'|'Trace'>} context
   * @return {Promise<LH.Artifacts['MainDocumentContent']>}
   */
  async getArtifact(context) {
    const devtoolsLog = context.dependencies.DevtoolsLog;
    const trace = context.dependencies.Trace;
    return this._getArtifact(context, devtoolsLog, trace);
  }

  /**
   * @param {LH.Gatherer.PassContext} passContext
   * @param {LH.Gatherer.LoadData} loadData
   * @return {Promise<LH.Artifacts['MainDocumentContent']>}
   */
  async afterPass(passContext, loadData) {
    if (!loadData.trace) throw new Error('trace required for LinkElements');
    return this._getArtifact({...passContext, dependencies: {}}, loadData.devtoolsLog,
        loadData.trace);
  }
}

export default MainDocumentContent;
