
import React from 'react';
import { Dropdown, Menu, Button, Modal } from 'antd';
import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal;

export default function Option({ menus = [], onChange, attrs }) {

    if (!menus || !attrs) {
        return '';
    }
    const { value, record, index, column, action } = attrs || {};

    const [firstMenu, ...otherMenus] = menus || [];

    function showConfirm(msg, callback) {
        confirm({
            title: msg,
            icon: <ExclamationCircleOutlined />,
            onOk() {
                callback()
            }
        });
    }

    const changeHandle = (key) => {
        const me = menus.find(item => item.key === key)
        if (!onChange) {
            return;
        }
        if (me.confirm) {
            showConfirm(me.confirm, () => {
                onChange(key, record, action, index)
            })
        } else {
            onChange(key, record, action, index)
        }
    }

    // 更多
    const MoreMenu = (<Menu
        onClick={async e => {
            changeHandle(e.key)
        }}
    >
        {otherMenus.map(item => {
            return (<Menu.Item key={item.key} icon={item.icon && item.icon} danger="true" >{item.title}</Menu.Item>)
        })}
    </Menu>)

    if (menus.length === 1) {
        return (<Button type="link"
            onClick={() => {
                changeHandle(firstMenu.key)
            }}>{firstMenu.icon && firstMenu.icon}{firstMenu.title}</Button>)
    }

    return (
        <Dropdown.Button
            size="small"
            type="link"
            icon={<DownOutlined />}
            onClick={() => {
                changeHandle(firstMenu.key)
            }}
            overlay={MoreMenu}
        >
            {firstMenu.icon && firstMenu.icon}{firstMenu.title}
        </Dropdown.Button>
    )
}