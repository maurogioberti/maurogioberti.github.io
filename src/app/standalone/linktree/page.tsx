import { linktreeViewModel } from './linktreeViewModel';

export default async function LinktreePage() {
  const { htmlContent } = await linktreeViewModel();

  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
}