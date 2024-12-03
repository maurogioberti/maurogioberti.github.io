



export async function postParamsViewModel() {
  // const getAllPostsUseCase = Container.resolve(GetAllPostsUseCase);
  // const posts = await getAllPostsUseCase.execute();
  
  // return posts.map((post) => ({
  //   slug: post.slug,
  // }));
  return [
    { slug: 'understanding-clean-architecture' },
    { slug: 'why-unit-testing-matters' },
  ];
}