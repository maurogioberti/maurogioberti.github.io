import { recordingsViewModel } from './recordingsViewModel';

export default async function RecordingsPage() {
  const { htmlContent } = await recordingsViewModel();

  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
}