/**
 * Arkin
 */
import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Input, Button } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import useMediaQuery from 'use-media-antd-query';
import classNames from 'classnames';
import './index.less';
import { isEmpty } from '../../utils'

/**
* 默认的查询表单配置
*/
const defaultColConfig = {
  xs: 24,
  sm: 24,
  md: 12,
  lg: 12,
  xl: 8,
  xxl: 6,
};

const AdvancedSearchForm = ({ fields = [], relation = 'and', onSearch = undefined, onReset = undefined, span = defaultColConfig }) => {

  /**
  * 合并用户和默认的配置
  * @param span
  * @param size
  */
  const getSpanConfig = (
    span,
    size,
  ) => {
    if (typeof span === 'number') {
      return span;
    }
    const config = {
      ...defaultColConfig,
      ...span,
    };
    return config[size];
  };

  const count = fields.length;
  const windowSize = useMediaQuery();
  const [colSize, setColSize] = useState(getSpanConfig(span || 8, windowSize));
  const rowNumber = 24 / colSize || 3;
  const [expand, setExpand] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    setColSize(getSpanConfig(span || 8, windowSize));
  }, [windowSize]);

  const colConfig = typeof span === 'number' ? { span } : span;

  const getFields = () => {

    const children = [];

    for (let i = 0; i < count; i++) {
      children.push(
        {
          name: `field-${i}`,
          label: `Field ${i}`,
          rules: [
            {
              required: true,
              message: 'Input something!',
            },
          ]
        }
      );
    }

    return children;
  };

  const formItemRender = (item, index) => {
    const { label = '', name = '_', render, placeholder = '', ...option } = item || {}
    return <Col {...colConfig} key={`${name}_${index}`} >
      <Form.Item
        labelAlign="right"
        label={item.label}
        name={item.name}
        {...option}
      >
        {render ? render() : <Input placeholder={placeholder} autoComplete="off" allowClear={true} />}
      </Form.Item>
    </Col>
  }

  //const fields= getFields();
  const rFields = fields.filter((_, index) => (expand ? true : index < (rowNumber - 1 || 1)));

  const renderFields = () => {
    return rFields.map((item, index) => {
      return formItemRender(item, index)
    })
  }

  /**
 * 获取最后一行的 offset，保证在最后一列
 * @param length
 * @param span
 */
  const getOffset = (length, span = 8) => {
    const cols = 24 / span;
    return (cols - 1 - (length % cols)) * span;
  };


  const ButtonGroup = () => {
    return <Col
      {...colConfig}
      offset={getOffset(rFields.length, colSize)}
      className={classNames('crud-search-form-option')}
    >
      <Form.Item>
        <Button type="primary" htmlType="submit">查 询</Button>
        <Button
          style={{
            margin: '0 8px',
          }}
          onClick={() => {
            let stopMark = false;
            if (onReset) {
              stopMark = onReset();
            }
            stopMark && form.resetFields();
          }}
        >
          重 置
    </Button>

        {' '}
        <a
          style={{
            fontSize: 12,
          }}
          onClick={() => {
            setExpand(!expand);
          }}
        >
          {expand ? <>收起 <UpOutlined style={{
            marginLeft: '0.5em',
            transition: '0.3s all',
            transform: `rotate(${expand ? 0 : 0.5}turn)`,
          }} /></> : <>展开 <UpOutlined style={{
            marginLeft: '0.5em',
            transition: '0.3s all',
            transform: `rotate(${expand ? 0 : 0.5}turn)`,
          }} /></>}
        </a>
      </Form.Item>
    </Col>
  }

  // 生成搜索fields
  const genSearchFields = (values) => {
    const conditions = {};
    if (!values || Object.keys(values).length < 1) {
      return conditions
    }
    fields.filter(item => item.name in values)
      .map(item => {
        conditions[item.name] = item.condition || '='
      })
    return conditions;
  }

  // 结束
  const onFinish = searchValues => {
    const values = {};
    Object.keys(searchValues)
      .filter(key => !isEmpty(searchValues[key]))
      .forEach(key => {
        values[key] = searchValues[key];
      })
    if (onSearch) {
      onSearch(values, genSearchFields(values), relation);
    }
  };

  return (
    <div className={classNames('crud-search-form')}>
      <Form
        form={form}
        name="crud_search"
        onFinish={onFinish}
      >
        <Row gutter={16} justify="start" >
          {renderFields()}
          {ButtonGroup()}
        </Row>
      </Form>
    </div>
  );
};

export default AdvancedSearchForm;