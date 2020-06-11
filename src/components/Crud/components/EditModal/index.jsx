import { Modal, Form, Input, Radio, Button, message } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import BaseForm from '@/components/Crud/components/BaseForm'

var submiting = false;
const EditModal = props => {
  const {
    actionRef,
    fields = [],
    title = "编辑",
    submitText = "确认",
    loadingText = "正在提交",
    resetText = "重置",
    request,
    onSuccess,
    onChange,
    onSubmit,
    debug = false,
    ...formProps
  } = props;
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [defaultValues, setDefaultValues] = useState({})
  // 
  const form = useRef()
  const userAction = {
    show(values) {
      showModal(values);
    },
    hide() {
      hideModal();
    }
  }

  useEffect(() => {
    if (actionRef && typeof actionRef === 'function') {
      actionRef(userAction);
    }
    if (actionRef && typeof actionRef !== 'function') {
      actionRef.current = userAction;
    }
  }, [])

  // 展示窗口
  const showModal = (values = undefined) => {
    if (debug) {
      console.debug('edit-form:defaultValues', values)
    }
    setDefaultValues(values)
    setVisible(true)
  }

  // 隐藏窗口
  const hideModal = () => {
    setDefaultValues({})
    setVisible(false)
    setLoading(false)
  }

  // 提交数据
  const postData = async (values) => {
    setLoading(true)
    message.destroy()
    try {
      const response = await request({ ...values });
      setLoading(false)
      const { status, msg = '操作成功.', data } = response || {}
      if (debug) {
        console.debug('edit-form:reponse', response)
      }
      if (status === 'ok') {
        message.destroy()
        message.success(msg);
        if (onSuccess) {
          onSuccess(actionRef, response);
        }
      } else {
        // 失败已经统一处理
      }
      return true;
    } catch (error) {
      message.destroy()
      setLoading(false)
      return false;
    }
  }


  return (
    <Modal
      destroyOnClose
      title={title}
      visible={visible}
      onCancel={hideModal}
      footer={[
        <Button key="back" onClick={() => {
          form.current.reset();
        }}>{resetText}</Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={() => {
            if (!submiting && !loading) {
              submiting = true;
              form.current.submit();
              setTimeout(() => {
                submiting = false;
              }, 1000);
            }
          }}
        >
          {loading ? loadingText : submitText}
        </Button>,
      ]}
      bodyStyle={{
        padding: '0'
      }}
    >
      <BaseForm
        {...formProps}
        actionRef={form}
        fields={fields}
        initialValues={defaultValues}
        submitText={submitText}
        resetText={resetText}
        renderButtons={false}
        onSubmit={(values) => {
          postData(values)
          if (onSubmit) {
            onSubmit(values, userAction)
          }
        }}
        onChange={(changedValues) => {
          onChange && onChange(changedValues, userAction)
        }}
      />
    </Modal>
  );
};

export default EditModal;
