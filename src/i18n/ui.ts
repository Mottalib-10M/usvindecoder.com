import type { Locale } from './routes';
const en = {
  updatedOn: 'Data updated on', editorialPolicy: 'Editorial policy', contactLabel: 'Contact', reviewedBy: 'Built by',
  skipToContent: 'Skip to content', mainNav: 'Main navigation', breadcrumbLabel: 'Breadcrumb', breadcrumbHome: 'Home', menuOpen: 'Open menu',
  faqTitle: 'Questions owners and buyers ask', relatedCalculators: 'Other free checks', sourcesTitle: 'Federal sources behind this page', writtenBy: 'Published by',
  asOf: 'Recall, rating and fuel economy data for', lastUpdated: 'pulled from NHTSA and EPA on', footerValidated: 'Sources: NHTSA vPIC, NHTSA recalls and NCAP, EPA fueleconomy.gov',
  footerBrowser: 'Your VIN goes from your browser to NHTSA and fueleconomy.gov only · no account, no email, no paid report',
  footerDisclaimer: 'Independent site published by Radif Partners. Not affiliated with NHTSA, the EPA, the Department of Justice or any carmaker. A decoded VIN describes how a vehicle was built, not what happened to it since: title brands, accidents and odometer history come from NMVTIS and state records. Information only: it does not replace the manufacturer’s recall notice, a title report or a mechanic’s inspection.',
  footerPopular: 'Recalls by brand and model',
  notFound: 'This address does not lead anywhere on the site. The decoder still reads any 17-character VIN and pulls its factory specs, recall campaigns, crash ratings and EPA fuel economy.',
  readMore: 'Read the full answer',
};
export function t(_lang: Locale) { return en; }
