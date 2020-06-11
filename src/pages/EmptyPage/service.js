import request from '@/utils/request';

// 查询
export async function query(params) {
  return request('/api/rule/query', {
    method: 'POST',
    data: params,
  });
}

// 创建
export async function add(params) {
  return request('/api/rule/post', {
    method: 'POST',
    data: { ...params, _method: 'post' },
  });
}

// 修改
export async function update(params) {
  return request('/api/rule/update', {
    method: 'POST',
    data: { ...params, _method: 'update' },
  });
}

// 删除
export async function remove(params) {
  return request('/api/rule/delete', {
    method: 'POST',
    data: { ...params, _method: 'delete' },
  });
}


