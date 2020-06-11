
import React from 'react';
import { EditModal } from '@/components/Crud/'
import { Input } from 'antd';
import { add } from '../service';
const request = add;

const UserForm = ({ actionRef, onSuccess, debug = false }) => {

  // 这个是表单,按这个写就写
  const fields = [
    {
      name: 'name', label: '规范名称', required: true,
    },
    {
      name: 'desc', label: '备注', render(value) { return <Input.TextArea /> },
    },
  ];

  return (
    <EditModal
      debug={debug}
      actionRef={actionRef}
      name="rule_new"
      title="创建规则"
      fields={fields}
      // 这个是网络请求方法,照写
      request={request}
      // 这个是操作成功回调,失败不用管了
      onSuccess={(ref, response) => {
        if (ref && ref.current) {
          ref.current.hide()
        }
        onSuccess && onSuccess(ref, response)
      }}
    />
  );
};

export default UserForm;
