import React, { useState, useEffect, useRef } from 'react';

import { Table } from 'antd';
import style from './index.less'

/** 参数 */
const IParamsInterface = {
  sorter: {},
  filter: {},
  page_size: 20,
  current_page: 1,
}


/** 分页类 */
const PaginationInterface = {
  showTotal: t => `共 ${t} 个`,
  showSizeChanger: true,
  showQuickJumper: true,
  total: 0,
  pageSize: 20,
  current: 1,
};

const ListTable = ({
  request,
  loading = false,
  actionRef,
  onSelectRow,
  pageSize = 20,
  data = {},
  columns = {},
  ellipsis = false,
  resize = false,
  selectionType = 'checkbox',
  showAutoIndex = true,
  ...props
}) => {
  const [params, setParams] = useState(IParamsInterface);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const firstRender = useRef(true);

  // 清除选择项
  const cleanSelectedKeys = () => {
    setSelectedRowKeys([])
    if (onSelectRow) {
      onSelectRow([], undefined)
    }
  }

  // 初始化
  useEffect(() => {
    const userAction = {
      clearSelected() {
        cleanSelectedKeys()
      },
    };

    if (actionRef && typeof actionRef === 'function') {
      actionRef({ current: userAction });
    }
    if (actionRef && typeof actionRef !== 'function') {
      actionRef.current = userAction;
    }
  }, [])

  useEffect(() => {
    if (request) {
      request(params)
    }
  }, [params])



  const { current_page = 1, list = [], per_page = pageSize, total = 0, sorters = {}, filters = {} } = data || {};
  const pagination = {
    ...PaginationInterface,
    total,
    pageSize: per_page,
    current: current_page,
  }

  // 重写column 
  const TableColumns = [...columns];
  TableColumns.map((column, index) => {
    if (sorters && column.dataIndex in sorters) {
      column.sorter = sorters[column.dataIndex]
    }
    if (filters && column.dataIndex in filters) {
      column.filters = filters[column.dataIndex]
    }
    if (column.ellipsis == undefined && ellipsis) {
      column.ellipsis = ellipsis
    }
    return column;
  })

  // index
  if (showAutoIndex) {
    TableColumns.unshift({
      dataIndex: '_index',
      title: '序号',
      width: 80,
      align: 'center',
      render(_1, _2, index) {
        return parseInt(per_page * (current_page - 1) + index + 1, 10);
      }
    })
  }

  // 重写数据
  const dataSource = list;

  // 表格变动
  const handleTableChange = (pagination, filtersArg, sorter) => {
    const { search } = params || {};
    const filter = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = filtersArg[key];
      return newObj;
    }, {});

    const queryParams = {
      current_page: pagination.current,
      page_size: pagination.pageSize,
      search,
      filter,
    };

    if (sorter.field) {
      const { field, order } = sorter || {};
      queryParams.sorter = {
        field,
        order: order === 'descend' ? 'desc' : 'asc',
      };
    }
    setParams(queryParams)
  };

  // 选择列
  const rowSelection = {
    columnWidth: 15,
    type: selectionType,
    selectedRowKeys,
    onChange: (rowKeys, selectedRows) => {
      setSelectedRowKeys(rowKeys)
      if (onSelectRow) {
        onSelectRow(rowKeys, selectedRows)
      }
    },
    getCheckboxProps: record => ({
      disabled: record.disabled,
    }),
  };


  return <Table
    {...props}
    className={style.CrudTable}
    columns={TableColumns}
    loading={loading}
    dataSource={dataSource}
    pagination={pagination}
    onChange={handleTableChange}
    rowSelection={selectionType === 'checkbox' || selectionType === 'radio' ? rowSelection : undefined}
  />;
}


export default ListTable;