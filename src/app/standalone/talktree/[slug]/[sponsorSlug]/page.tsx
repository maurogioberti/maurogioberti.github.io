import { Metadata } from 'next';

import { TalktreeMetadata } from '@/core/crosscutting/seo/talktree';

import { talktreeInfoViewModel } from './talktreeInfoViewModel';
import { talktreeParamsViewModel } from './talktreeParamsViewModel';
import { talktreeViewModel } from './talktreeViewModel';

type TalktreePageProps = {
  params: { slug: string, sponsorSlug: string };
};

export async function generateMetadata({ params }: TalktreePageProps): Promise<Metadata> {
  const { presentation } = await talktreeInfoViewModel(params.slug, params.sponsorSlug);
  return TalktreeMetadata.generate(presentation);
}

export default async function TalktreePage({ params }: TalktreePageProps) {
  const { htmlContent } = await talktreeViewModel(params.slug, params.sponsorSlug);
  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
}

export async function generateStaticParams() {
  const params = await talktreeParamsViewModel();
  return params;
}