/**
 * @license Copyright 2023 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

/**
 * @fileoverview Ensures all elements with `role=text` have no focusable descendents.
 * See base class in axe-audit.js for audit() implementation.
 */

import AxeAudit from './axe-audit.js';
import * as i18n from '../../lib/i18n/i18n.js';

const UIStrings = {
  /** Title of an accesibility audit that evaluates if elements with `role=text` have no focusable descendents. This title is descriptive of the successful state and is shown to users when no user action is required. */
  title: 'Elements with the `role=text` attribute do not have focusable descendents.',
  /** Title of an accesibility audit that evaluates if elements with `role=text` have focusable descendents. This title is descriptive of the successful state and is shown to users when no user action is required. */
  failureTitle: 'Elements with the `role=text` attribute do have focusable descendents.',
  /** Description of a Lighthouse audit that tells the user *why* they should try to pass. This is displayed after a user expands the section to see more. No character length limits. The last sentence starting with 'Learn' becomes link text to additional documentation. */
  description: 'Adding `role=text` around a text node split by markup enables VoiceOver to treat ' +
      'it as one phrase, but the element\'s focusable descendents will not be announced. ' +
      '[Learn more about the `role=text` attribute](https://dequeuniversity.com/rules/axe/4.8/aria-text).',
};

const str_ = i18n.createIcuMessageFn(import.meta.url, UIStrings);

class AriaText extends AxeAudit {
  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    return {
      id: 'aria-text',
      title: str_(UIStrings.title),
      failureTitle: str_(UIStrings.failureTitle),
      description: str_(UIStrings.description),
      requiredArtifacts: ['Accessibility'],
    };
  }
}

export default AriaText;
export {UIStrings};
