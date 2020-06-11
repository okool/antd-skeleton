import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { SettingOutlined } from '@ant-design/icons';
import { Popover, Checkbox } from 'antd';

const ColumnSetting = ({ columns, option = {}, onChange }) => {
    const [selectedColumns, setSelectedColumns] = useState({});


    useEffect(() => {
        setAllSelectAction()
    }, [])

    useEffect(() => {
        changeHandle()
    }, [selectedColumns], true)

    const changeHandle = () => {
        if (onChange && (typeof (onChange) === 'function')) {
            onChange(selectedColumns)
        }
    }

    const CheckboxList = () => (
        <div
            style={{
                display: 'flex',
                'flexDirection': 'column',
                'width': '168px'
            }}
        >
            {''}
            {
                columns.map((item) => {
                    const { dataIndex } = item || {}
                    const defaultSetting = selectedColumns[dataIndex || 'null'] || { show: false }
                    return <span key={dataIndex}>
                        <Checkbox
                            checked={defaultSetting.show !== false}
                            onChange={(e) => {
                                const newSetting = selectedColumns[dataIndex] || { show: false }
                                if (e.target.checked) {
                                    newSetting.show = true
                                } else {
                                    newSetting.show = false
                                }
                                const columnKeyMap = {
                                    ...selectedColumns,
                                    [dataIndex]: newSetting,
                                }
                                setSelectedColumns(columnKeyMap);
                            }}
                        >
                            {item.title}
                        </Checkbox>
                    </span>
                })
            }
        </div>
    )

    const columnLength = Object.keys(selectedColumns).filter(key => selectedColumns[key].show).length;
    const indeterminate = columnLength > 0 && columnLength !== columns.length;

    const setAllSelectAction = (show = undefined) => {
        const columnKeyMap = {};
        columns.forEach(({ dataIndex, hide }) => {
            if (show !== undefined) {
                columnKeyMap[dataIndex] = { show: !!show }
            } else {
                columnKeyMap[dataIndex] = { show: !hide }
            }
        })
        setSelectedColumns(columnKeyMap)
    }


    // 头部
    const header = (
        <div style={{ display: 'flex' }}>
            <Checkbox
                style={{ flex: '1 1' }}
                indeterminate={indeterminate}
                checked={columnLength === columns.length}
                onChange={(e) => {
                    if (e.target.checked) {
                        setAllSelectAction(true);
                    } else {
                        setAllSelectAction(false);
                    }
                }}
            >
                列展示</Checkbox>
            <a
                style={{ minWidth: '2.5em' }}
                onClick={() => {
                    setAllSelectAction();
                }}
            >重 置</a>
        </div >
    );

    // 中间的
    const content = (
        <div>
            {CheckboxList()}
        </div>
    );

    return <div>
        <Popover title={header} placement="bottomRight" content={content} trigger="click">
            <a >{option.icon || <SettingOutlined />}</a>
        </Popover>
    </div>
}

export default ColumnSetting;
