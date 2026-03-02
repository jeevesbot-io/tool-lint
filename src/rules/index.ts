import { Rule } from '../types';
import { missingToolDescription } from './missing-tool-description';
import { vagueToolDescription } from './vague-tool-description';
import { missingParamDescription } from './missing-param-description';
import { vagueParamName } from './vague-param-name';
import { tooManyParams } from './too-many-params';
import { deeplyNestedSchema } from './deeply-nested-schema';
import { missingRequiredField } from './missing-required-field';
import { ambiguousEnum } from './ambiguous-enum';
import { noTypeSpecified } from './no-type-specified';
import { oversizedDescription } from './oversized-description';
import { missingToolName } from './missing-tool-name';
import { duplicateParamNames } from './duplicate-param-names';

export const ALL_RULES: Rule[] = [
  missingToolName,
  missingToolDescription,
  vagueToolDescription,
  missingParamDescription,
  vagueParamName,
  tooManyParams,
  deeplyNestedSchema,
  missingRequiredField,
  ambiguousEnum,
  noTypeSpecified,
  oversizedDescription,
  duplicateParamNames,
];

export function getRuleById(id: string): Rule | undefined {
  return ALL_RULES.find(rule => rule.id === id);
}

export function getEnabledRules(ignoreList: string[] = []): Rule[] {
  return ALL_RULES.filter(rule => !ignoreList.includes(rule.id));
}
