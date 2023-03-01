import Mock from 'mockjs';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';
import type { NodeRecord } from '@/api/filelist';

setupMock({
  setup() {
    Mock.mock(new RegExp('/api/filelist'), () => {
      // return failResponseWrap(null, '重新登陆', 50008);
      const { Random } = Mock;
      const total = Random.integer(20, 30);
      const list = Array.from(new Array<NodeRecord>(total), () =>
        Mock.mock({
          'id': '@id',
          'parent_file_id': '@id',
          'name': '@cword(8,16)',
          'created_at': "@now('minute')",
          'updated_at': "@now('second')",
          'type|1': ['folder', 'file'],
          'file_extension': '',
          'size': '@integer(0,100000)',
        })
      );
      const data = { list, total };
      return successResponseWrap(data);
    });
  },
});
