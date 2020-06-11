
import React from 'react';
import { Badge } from 'antd';


export default function Enum({ attrs }) {
    if (!attrs) {
        return '';
    }
    // 专用组件
    const { value, record, index, column, action } = attrs || {};
    const { filters } = column || {};
    let filter = filters.find(item => item.value == value)
    const defaultFilter = { text: value, status: 'default', color: '' };
    filter = { ...defaultFilter, ...filter }
    return <Badge
        status={(filter.status).toLowerCase()}
        text={filter.text}
        color={filter.color}
    />

}