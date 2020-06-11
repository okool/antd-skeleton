// eslint-disable-next-line import/no-extraneous-dependencies
import { parse } from 'url';

// 成功返回
function SuccessRes(msg = 'ok', data = undefined) {
  return { data, status: 'ok', error_code: 0, msg }
}

// 失败返回
function ErrorRes(msg, errorCode = 500, errors = []) {
  return { status: 'error', error_code: errorCode, msg, errors: '' }
}

// 异常
function ExceptRes(trace, errorCode = 500) {
  return { status: 'exception', error_code: errorCode, trace, msg: '服务异常.' }
}

// mock tableListDataSource
const genList = (current, pageSize) => {
  const tableListDataSource = [];

  const st = 1000000000000
  for (let i = 0; i < pageSize; i += 1) {
    const index = (current - 1) * 10 + i;
    tableListDataSource.push({
      id: index,
      disabled: i % 6 === 0,
      href: 'https://ant.design',
      avatar: [
        'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
        'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png',
      ][i % 2],
      name: `TradeCode ${index}`,
      owner: '曲丽丽',
      desc: '这是一段描述',
      callNo: Math.floor(Math.random() * 1000),
      status: Math.floor(Math.random() * 10) % 4,
      updatedAt: new Date(st + 8640000 * Math.ceil(Math.random() * 10)),
      createdAt: new Date(),
      progress: Math.ceil(Math.random() * 100),
    });
  }

  tableListDataSource.reverse();
  return tableListDataSource;
};

let tableListDataSource = genList(1, 100);

// 查询
function queryData(req, res, u) {

  const { params } = req.body;
  const { current_page = 1, page_size = 15, sorter = {}, filter = {}, search = {} } = JSON.parse(params) || {}
  let dataSource = [...tableListDataSource].slice((current_page - 1) * page_size, current_page * page_size);

  // 排序
  const { field = undefined, order = 'asc' } = sorter || {}
  if (field) {
    dataSource = dataSource.sort((prev, next) => {
      if (order === 'desc') {
        return next[field] - prev[field];
      }

      return prev[field] - next[field];
    });
  }

  // 过滤 
  if (filter.status) {
    const status = filter.status;
    let filterDataSource = [];
    status.forEach(s => {
      filterDataSource = filterDataSource.concat(
        dataSource.filter(item => {
          if (parseInt(`${item.status}`, 10) === parseInt(s.split('')[0], 10)) {
            return true;
          }

          return false;
        }),
      );
    });
    dataSource = filterDataSource;
  }

  // 搜索
  if (search.name) {
    dataSource = dataSource.filter(data => data.name.includes(search.name || ''));
  }

  const result = {
    list: dataSource,
    total: tableListDataSource.length,
    per_page: page_size,
    current_page: current_page || 1,
    filters: {
      status: [
        { value: 0, text: '关闭', status: 'default' },
        { value: 1, text: '进行中', status: 'processing' },
        { value: 2, text: '已完成', status: 'success' },
        { value: 3, text: '已结束', status: 'error' },
      ]
    },
    sorters: {
      updatedAt: 'desc'
    }
  };
  return res.json(SuccessRes('ok', result));
}


// 新增
function postData(req, res) {
  const { name = '', desc = '' } = req.body;
  if (!name) {
    return res.json(ErrorRes('名称不能为空.', 300, { name: '名称不能为空' }));
  }
  if (desc.length > 20) {
    return res.json(ErrorRes('备注符合规范.', 300, { desc: '备注不能大于20字' }));
  }
  (() => {
    const i = Math.ceil(Math.random() * 10000);
    const newRule = {
      id: tableListDataSource.length,
      href: 'https://ant.design',
      avatar: [
        'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
        'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png',
      ][i % 2],
      name,
      owner: '曲丽丽',
      desc,
      callNo: Math.floor(Math.random() * 1000),
      status: Math.floor(Math.random() * 10) % 2,
      updatedAt: new Date(),
      createdAt: new Date(),
      progress: Math.ceil(Math.random() * 100),
    };
    tableListDataSource.unshift(newRule);

    return res.json(SuccessRes('添加成功.', newRule));
  })();
}

// 修改
function updateRecord(req, res) {
  const { name = '', desc = '', id } = req.body;
  if (!id) {
    return res.json(ErrorRes('缺少记录ID', 500));
  }
  let newRule = {};
  tableListDataSource = tableListDataSource.map(item => {
    if (item.id == id) {
      newRule = { ...item, desc, name };
      return newRule;
    }

    return item;
  });

  return res.json(SuccessRes('修改成功.', newRule));
}


// 删除
function deleteRecord(req, res) {
  const { ids } = req.body;
  if (!ids || ids.length < 1) {
    return res.json(ErrorRes('缺少记录ID', 500));
  }
  tableListDataSource = tableListDataSource.filter(item => ids.indexOf(item.id + '') === -1);
  console.log(tableListDataSource.length)
  return res.json(SuccessRes('删除成功.'))
}


export default {
  'POST /api/rule/query': queryData,
  'POST /api/rule/post': postData,
  'POST /api/rule/update': updateRecord,
  'POST /api/rule/delete': deleteRecord,
}
