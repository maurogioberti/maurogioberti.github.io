import { linktreeViewModel } from './linktreeViewModel';

// Next only reads `metadata` exported from page/layout modules, so it has to be
// re-exported here — declaring it in the view model alone has no effect.
export { metadata } from './linktreeViewModel';

export default async function LinktreePage() {
  const { htmlContent } = await linktreeViewModel();

  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
}