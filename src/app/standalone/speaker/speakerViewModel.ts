import { GetAllPresentationsUseCase } from '@/core/application/get-all-presentations-use-case';
import { GetProfileUseCase } from '@/core/application/get-profile-content-use-case';
import { DependencyIdentifiers } from '@/core/crosscutting/injection/DependencyIdentifiers';
import { container } from '@/core/crosscutting/injection/DependencyInjectionContainer';
import { formatDate } from '@/core/crosscutting/utils/date';
import { PRESENTATION_STATUS, PRESENTATION_TYPE, Presentation } from '@/core/domain/model/Presentation';

const SPEAKER_FEATURED_RECORDINGS_COUNT = 2;

const PRESENTATION_TYPE_LABELS = {
  [PRESENTATION_TYPE.ONLINE]: 'Online',
  [PRESENTATION_TYPE.ONSITE]: 'On-site',
  [PRESENTATION_TYPE.HYBRID]: 'Hybrid',
};

const PRESENTATION_STATUS_LABELS = {
  [PRESENTATION_STATUS.UPCOMING]: 'Upcoming',
  [PRESENTATION_STATUS.ONGOING]: 'Live now',
  [PRESENTATION_STATUS.PAST]: 'Past session',
};

export type SpeakerSession = {
  id: string;
  title: string;
  description: string;
  eventName: string;
  location?: string;
  date: Date;
  formattedDate: string;
  dateYear: number;
  typeLabel: string;
  statusLabel: string;
  thumbnailUrl: string;
  detailUrl: string;
  standaloneUrl: string;
  tags: string[];
  postUrl?: string;
  repositoryUrl?: string;
  slidesUrl?: string;
  videoUrl?: string;
  registrationUrl?: string;
};

function stripHtml(value: string): string {
  return value
    .replace(/<br\s*\/?\s*>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function mapSession(presentation: Presentation): SpeakerSession {
  return {
    id: presentation.id,
    title: presentation.title,
    description: stripHtml(presentation.description),
    eventName: presentation.eventName || presentation.sponsor,
    location: presentation.location,
    date: presentation.date,
    formattedDate: formatDate(presentation.date),
    dateYear: presentation.date.getFullYear(),
    typeLabel: PRESENTATION_TYPE_LABELS[presentation.type],
    statusLabel: PRESENTATION_STATUS_LABELS[presentation.status],
    thumbnailUrl: presentation.thumbnailUrl,
    detailUrl: `/pages/talks/${presentation.slug}/${presentation.sponsorSlug}`,
    standaloneUrl: `/standalone/talktree/${presentation.slug}/${presentation.sponsorSlug}`,
    tags: presentation.tags,
    postUrl: presentation.postUrl,
    repositoryUrl: presentation.repositoryUrl,
    slidesUrl: presentation.slidesUrl,
    videoUrl: presentation.videoUrl,
    registrationUrl: presentation.registrationUrl,
  };
}

export async function speakerViewModel() {
  const getProfileUseCase = container.resolve<GetProfileUseCase>(
    DependencyIdentifiers.USE_CASES.GET_PROFILE
  );
  const getAllPresentationsUseCase = container.resolve<GetAllPresentationsUseCase>(
    DependencyIdentifiers.USE_CASES.GET_ALL_PRESENTATIONS
  );

  const [profile, presentations] = await Promise.all([
    getProfileUseCase.execute(),
    getAllPresentationsUseCase.execute(),
  ]);

  const sessions = [...presentations]
    .sort((left, right) => right.date.getTime() - left.date.getTime())
    .map(mapSession);

  const featuredRecordings = sessions
    .filter((session) => Boolean(session.videoUrl))
    .slice(0, SPEAKER_FEATURED_RECORDINGS_COUNT);

  return { profile, sessions, featuredRecordings };
}
