import { Content } from "@/models/content";
import { ContentProfile } from "@/models/partners";
import { findDuplicates } from "@/utils/stringArrayUtils";
import { ValidationError } from "@/utils/ValidationError";


export function validateContentProfile(partners: ContentProfile[], content: Content): ValidationError | null {
  // Partners (no references. we call ids "pic" (partner identification code) for partners)
  const duplicatePartnerPics = findDuplicates(partners.map(partner => partner.pic));
  if (duplicatePartnerPics.length > 0) {
    return new ValidationError(
      `Some entries are duplicated! Please ensure that all entries are unique.`,
      duplicatePartnerPics.map(pic => `Partner with pic "${pic}" is duplicated.`)
    );
  }

  // Ensure that the languages referenced in the partner profiles actually exist in the content.
  const languageIds = new Set(content.languages.map(language => language.languageId));
  const missingLanguageIds = new Set<string>();
  partners.forEach(partner => {
    partner.languages.forEach(languageId => {
      if (!languageIds.has(languageId)) {
        missingLanguageIds.add(languageId);
      }
    });
  });
  if (missingLanguageIds.size > 0) {
    return new ValidationError(
      `Some references are missing! Please change the references or add the missing objects to their corresponding tables.`,
      Array.from(missingLanguageIds).map(id => `Language with languageId "${id}" is referenced in a partner profile but does not exist in the content.`)
    );
  }

  // If we reach this point, the data is valid.
  return null;
}
