import React from 'react';
import { dateFormat } from '../../utils'


export default function Enum({ format = 'yyyy-MM-dd HH:mm', attrs }) {
    if (!attrs) {
        return '';
    }
    // 专用组件
    const { value, record, index, column, action } = attrs || {};
    const fdate = new Date();
    return dateFormat(fdate, format)
}