
import { Modal, Form, Input, Radio, Button, Dropdown, Menu } from 'antd';
import { Component } from 'react';
import { Rule } from 'antd/es/form';



export interface FieldInterface {
    name: string,
    label: string,
    placeholder?: string,
    rules?: [Rule],
    render?: (value: any) => (Component),
    extra?: String,
    colon?: String,
    value?: any
}