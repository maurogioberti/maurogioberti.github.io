import { recordingsViewModel } from './recordingsViewModel';

// Next only reads `metadata` exported from page/layout modules, so it has to be
// re-exported here — declaring it in the view model alone has no effect.
export { metadata } from './recordingsViewModel';

export default async function RecordingsPage() {
  const { htmlContent } = await recordingsViewModel();

  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
}