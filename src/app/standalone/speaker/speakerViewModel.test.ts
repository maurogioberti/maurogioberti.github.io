import { beforeEach, describe, expect, jest, test } from '@jest/globals';

import { DependencyIdentifiers } from '@/core/crosscutting/injection/DependencyIdentifiers';
import { container } from '@/core/crosscutting/injection/DependencyInjectionContainer';
import { PRESENTATION_TYPE, Presentation } from '@/core/domain/model/Presentation';

import { speakerViewModel } from './speakerViewModel';

function createPresentation({
  id,
  title,
  date,
  description = 'A practical session.<br />With working code.',
  videoUrl,
}: {
  id: string;
  title: string;
  date: Date;
  description?: string;
  videoUrl?: string;
}) {
  return new Presentation(
    id,
    title,
    `${id}-slug`,
    'Community Event',
    'community-event',
    PRESENTATION_TYPE.ONSITE,
    description,
    'Barcelona',
    'English',
    date,
    `/assets/${id}.png`,
    'Community Event',
    'Barcelona, Spain',
    undefined,
    `https://github.com/example/${id}`,
    `https://slides.example.com/${id}`,
    undefined,
    videoUrl,
    `https://events.example.com/${id}`,
    undefined,
    undefined,
    ['AI', 'Architecture']
  );
}

describe('standalone speakerViewModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(container, 'resolve');
  });

  test('maps talks newest first and selects the two latest recordings', async () => {
    const profile = { fullname: 'Mauro Gioberti' };
    const oldest = createPresentation({
      id: 'oldest',
      title: 'Oldest session',
      date: new Date('2024-01-10T12:00:00.000Z'),
      videoUrl: 'https://youtube.com/watch?v=oldest',
    });
    const newest = createPresentation({
      id: 'newest',
      title: 'Newest session',
      date: new Date('2026-05-14T12:00:00.000Z'),
      description: 'RAG systems.<br>Architecture, evaluation, and trade-offs.',
    });
    const middle = createPresentation({
      id: 'middle',
      title: 'Middle session',
      date: new Date('2025-09-18T12:00:00.000Z'),
      videoUrl: 'https://youtube.com/watch?v=middle',
    });
    const recentRecording = createPresentation({
      id: 'recent-recording',
      title: 'Recent recording',
      date: new Date('2026-02-20T12:00:00.000Z'),
      videoUrl: 'https://youtube.com/watch?v=recent',
    });
    const presentations = [oldest, newest, middle, recentRecording];
    const getProfileUseCase = { execute: jest.fn<() => Promise<typeof profile>>().mockResolvedValue(profile) };
    const getAllPresentationsUseCase = {
      execute: jest.fn<() => Promise<Presentation[]>>().mockResolvedValue(presentations),
    };

    (container.resolve as jest.Mock)
      .mockImplementationOnce(() => getProfileUseCase)
      .mockImplementationOnce(() => getAllPresentationsUseCase);

    const result = await speakerViewModel();

    expect(container.resolve).toHaveBeenNthCalledWith(1, DependencyIdentifiers.USE_CASES.GET_PROFILE);
    expect(container.resolve).toHaveBeenNthCalledWith(2, DependencyIdentifiers.USE_CASES.GET_ALL_PRESENTATIONS);
    expect(result.profile).toBe(profile);
    expect(result.sessions.map((session) => session.id)).toEqual([
      'newest',
      'recent-recording',
      'middle',
      'oldest',
    ]);
    expect(result.sessions[0]).toMatchObject({
      description: 'RAG systems. Architecture, evaluation, and trade-offs.',
      detailUrl: '/pages/talks/newest-slug/community-event',
      standaloneUrl: '/standalone/talktree/newest-slug/community-event',
      eventName: 'Community Event',
      location: 'Barcelona, Spain',
      typeLabel: 'On-site',
      tags: ['AI', 'Architecture'],
    });
    expect(result.featuredRecordings.map((recording) => recording.id)).toEqual([
      'recent-recording',
      'middle',
    ]);
    expect(presentations).toEqual([oldest, newest, middle, recentRecording]);
  });
});
