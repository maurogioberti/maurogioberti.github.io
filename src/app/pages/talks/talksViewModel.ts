import { GetAllPresentationsUseCase } from '@/core/application/get-all-presentations-use-case';
import { DependencyIdentifiers } from '@/core/crosscutting/injection/DependencyIdentifiers';
import { container } from '@/core/crosscutting/injection/DependencyInjectionContainer';

export async function talksViewModel() {
    const getAllPresentationsUseCase = container.resolve<GetAllPresentationsUseCase>(DependencyIdentifiers.USE_CASES.GET_ALL_PRESENTATIONS);
    const talks = await getAllPresentationsUseCase.execute();
    return { talks };
}