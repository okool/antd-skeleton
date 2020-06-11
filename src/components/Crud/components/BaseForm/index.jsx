
import { Modal, Form, Input, Radio, Button, Dropdown, Menu } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { SettingOutlined, BugOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import './index.less'


const FieldInterface = {
    name: '',
    label: '',
    placeholder: '',
    rules: [
    ],
    render() { return <Input /> },
    extra: '',
    colon: ':',
    value: undefined,
}

const BaseForm = props => {
    const {
        fields = [],
        initialValues = {},
        submitText = "提交",
        resetText = "重置",
        renderButtons = undefined,
        actionRef = undefined,
        layout = 'horizontal',
        onSubmit = undefined,
        onChange,
        ...formProps
    } = props || {}
    const [form] = Form.useForm();
    const [formLayout, setFormLayout] = useState(layout);

    /**
     * 开放接口
     */
    const userAction = {
        // 提交
        submit() {
            form.submit();
        },
        // 重置
        reset() {
            form.resetFields();
        },
        // 获取原生form
        getForm() {
            return form;
        },
        // 获取所有值
        getValues() {
            return form.getFieldsValue();
        }
    }

    /**
     * 初始化
     */
    useEffect(() => {
        if (actionRef && typeof actionRef === 'function') {
            actionRef(userAction);
        }
        if (actionRef && typeof actionRef !== 'function') {
            actionRef.current = userAction;
        }
    }, [])

    const onFormLayoutChange = ({ key }) => {
        setFormLayout(key);
    };

    const formItemLayout =
        formLayout === 'horizontal'
            ? {
                labelCol: { span: 6 },
                wrapperCol: { span: 14 },
            }
            : null;

    const buttonItemLayout =
        formLayout === 'horizontal'
            ? {
                wrapperCol: { span: 14, offset: 4 },
            }
            : null;

    const menu = (
        <Menu onClick={onFormLayoutChange}>
            <Menu.Item key="horizontal">横排列</Menu.Item>
            <Menu.Item key="vertical">纵排列</Menu.Item>
            <Menu.Item key="inline">一行排</Menu.Item>
        </Menu>
    )

    // 渲染组件
    const renderField = () => {
        return fields
            .filter(item => item.show !== false)
            .map(({ label = '', required = undefined, name = '_', placeholder = '', rules = [], render, ...itemProps }) => {
                if (required) {
                    rules.push({ required: true })
                }
                const itemRender = render ? render() : <Input placeholder={placeholder} allowClear={true} autoComplete="off" />
                return <Form.Item
                    {...itemProps}
                    label={label}
                    key={name}
                    name={name}
                    rules={rules}
                    autoComplete="off"
                >
                    {itemRender}
                </Form.Item>
            })
    }

    return (<div className={classNames('crud-base-form')}>
        <div className={classNames('crud-form-option')} >
            <Dropdown overlay={menu}><a><SettingOutlined /></a></Dropdown>
        </div>
        <Form
            {...formItemLayout}
            {...formProps}
            layout={formLayout}
            form={form}
            onFinish={values => { onSubmit && onSubmit(values) }}
            onValuesChange={(values) => {
                onChange && onChange(values)
            }}
            scrollToFirstError={true}
            autoComplete="off"
            initialValues={initialValues}
        >
            {renderField()}
            {renderButtons === false ? ''
                :
                <Form.Item {...buttonItemLayout}>
                    {typeof (renderButtons) == 'function' ?
                        renderButtons(form) : <>
                            <Button type="primary" htmlType="submit" style={{ marginRight: '16px' }}>
                                {submitText}
                            </Button>
                            <Button onClick={() => { form.resetFields() }}>
                                {resetText}
                            </Button>
                        </>
                    }
                </Form.Item>
            }

        </Form>
    </div>)
}

export default BaseForm;