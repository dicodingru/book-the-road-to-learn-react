import { updateSearchTopStoriesState } from './helpers';

describe('updateSearchTopStoriesState', () => {
  test('should return correct new state', () => {
    const hits = [
      {
        title: '1',
        author: '1',
        num_comments: 1,
        points: 2,
        objectID: 'y',
      },
      {
        title: '2',
        author: '2',
        num_comments: 1,
        points: 2,
        objectID: 'z',
      },
    ];
    const page = 0;

    const cb = updateSearchTopStoriesState(hits, page);

    const prevState = {
      isLoading: true,
      results: {
        redux: {
          hits: [],
          page: 0,
        },
      },
      searchKey: 'redux',
    };

    expect(cb(prevState)).toEqual({
      isLoading: false,
      results: {
        redux: {
          hits: [
            {
              title: '1',
              author: '1',
              num_comments: 1,
              points: 2,
              objectID: 'y',
            },
            {
              title: '2',
              author: '2',
              num_comments: 1,
              points: 2,
              objectID: 'z',
            },
          ],
          page: 0,
        },
      },
    });
  });
});
