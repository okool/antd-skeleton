
import React, { useState, useRef, useEffect } from 'react';
import { EditModal } from '@/components/Crud/'
import { Input } from 'antd';
import { update } from '../service';
const request = update;

const UserForm = ({ actionRef, onSuccess, debug = false }) => {

  const formRef = useRef()
  const [record, setRecord] = useState(undefined)

  const userAction = {
    show(record) {
      setRecord(record)
      if (formRef.current) {
        // 修改入参在这里
        formRef.current.show(record)
      }
    },
    hide() {
      if (formRef.current) {
        setRecord(undefined)
        formRef.current.hide();
      }
    }
  }

  // 照写
  useEffect(() => {
    if (actionRef && typeof actionRef === 'function') {
      actionRef(userAction);
    }
    if (actionRef && typeof actionRef !== 'function') {
      actionRef.current = userAction;
    }
  }, [])

  // 表单字段
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
      actionRef={formRef}
      name="rule_edit"
      title="修改规则"
      fields={fields}
      // 这个是网络请求方法,照写
      request={async (params) => {
        // 修改请求内容
        return request({ ...params, id: record.id })
      }}
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
