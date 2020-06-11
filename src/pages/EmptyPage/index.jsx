import { PlusOutlined, EditOutlined, DeleteOutlined, MoreOutlined, } from '@ant-design/icons';
import { Button, message } from 'antd';
import React, { useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { PlusTable } from '@/components/Crud';
import { DateCell, EnumCell } from '@/components/Crud/cells'
import CreateForm from './components/CreateForm'
import UpdateForm from './components/UpdateForm'
import { query, remove } from './service';

const TablePage = () => {

  const createRef = useRef();
  const updateRef = useRef();

  // 这个搜索的字段
  const SearchFields = [
    {
      name: 'name',
      label: '名称',
      placeholder: '请填写名称',
      condition: '=',// 默认操作符 '=', 支持 ['in' ,'like' , '>' , '<' , '>'= , '<=','between']
      render() { return <Input placeholder="请输入名称" autoComplete="off" allowClear={true} /> }
    },
    { name: 'desc', label: '描述', placeholder: '', condition: 'like' },
    { name: 'create', label: '开始时间', }
  ];

  // 这是表格的字段列表
  const columns = [
    {
      title: '规则名称',
      dataIndex: 'name',
    },
    {
      title: '描述',
      dataIndex: 'desc',
      hide: true,
    },
    {
      title: '服务调用次数',
      dataIndex: 'callNo',
      render: val => `${val} 亿`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      filters: [
        {
          text: '激活',
          value: '1',
        },
        {
          text: '禁用',
          value: '0',
        },
      ],
      // 只支持 dom 和 函数组件
      valueType: <EnumCell />,
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      sorter: 'ascend',
      valueType: <DateCell format="yyyy-MM-dd" />
    },
  ];


  // 删除
  const removeHandle = async (ids) => {
    const res = await remove({ ids: ids });
    if (res.status == 'ok') {
      message.success(res.msg || '操作完成')
    } else {
      return false;
    }
    return true;
  }

  // 渲染工具栏
  const toolBarRender = (action, { selectedRowKeys, selectedRows }) => {
    return [
      <Button
        type="primary"
        onClick={() => {
          createRef.current.show()
        }}
      >
        <PlusOutlined /> 新建
        </Button>
      ,
      <Button
        danger
        disabled={(!selectedRowKeys || selectedRowKeys.length < 1)}
        onClick={async e => {
          await removeHandle(selectedRowKeys)
          action.cleanSelect();
          action.reload();
        }}
      >
        批量删除
        </Button>
      ,
    ];
  }


  // 操作区
  const options = [
    { key: 'edit', title: '编辑', icon: <EditOutlined /> },
    { key: 'delete', title: '删除', icon: <DeleteOutlined />, confirm: '确认删除该记录么?' },
    { key: 'detail', title: '详情', icon: <MoreOutlined /> },
  ]


  // 操作区点击事件
  const onOptionChange = async (key, record, action) => {
    switch (key) {
      case 'edit':
        console.log('修改')
        updateRef.current.show(record)
        break;
      case 'delete':
        await removeHandle([record.id])
        action.cleanSelect();
        action.reload();
        break;
      case 'detail':
        console.log('详情');
        break;
    }
  }


  // 渲染其他的,如弹框
  const otherRender = (action) => {
    return <>
      <CreateForm
        debug={true} // 开启调试
        actionRef={createRef}
        onSuccess={(ref, response) => {
          action.reload();
        }}
      />
      <UpdateForm
        debug={true} // 开启调试
        actionRef={updateRef}
        onSuccess={(ref, response) => {
          action.reload();
        }}
      />
    </>
  }

  return (
    <PageHeaderWrapper>
      <PlusTable
        rowKey='id'
        columns={columns}
        request={query}
        searchFields={SearchFields}
        // relation='and' // 组合关系
        // bordered={true}
        // pageSize={10}
        title="示例表格"
        debug={true} // 开启调试
        // ellipsis={true} 所有自动提示
        //showHeader={false}
        //showAlert={false}
        //showToolbar={false}
        //showAutoIndex={false} // 序号
        //selectionType='radio'// default 'checkbox | radio'
        // tableAlertRender={(selectKeys, selectedRows) => {
        //   return `已选择 ${selectKeys.length} 项,共计`
        // }}
        toolBarRender={toolBarRender}
        otherRender={otherRender}
        options={options}
        onOptionChange={onOptionChange}
      />

    </PageHeaderWrapper>
  );
};

export default TablePage;
