import { SettingOutlined, ReloadOutlined, } from '@ant-design/icons';
import { Alert } from 'antd';
import React, { useState, useRef, useEffect, useLayoutEffect, cloneElement, Component } from 'react';
import ListTable from '../ListTable'
import SearchForm from '../SearchForm'
import ColumnSetting from '../ColumnSetting'
import { OptionCell } from '../../cells'
import style from './index.less'


/** 参数 */
const IParams = {
    search: {},// {any} 表单搜索
    search_fields: [],// [string] 搜索条件
    sorter: {},// {field:string,order:'asc|desc'} 排序
    filter: {},// {and} 过滤 
    page_size: 20,// 分页
    current_page: 1,// 当前,
    fields: '*',// 选择的列,默认*
    relation: 'and',//默认条件
}

const PlusTable = (props) => {
    const {
        rowKey = 'id',
        request,
        toolBarRender,
        searchFields = [],
        relation = 'and',
        columns = [],
        title = '',
        showToolbar = true,
        showAlert = true,
        tableAlertRender,
        pageSize = 20,
        otherRender,
        options = [],
        onOptionChange,
        debug = false,
        ...tableProps
    } = props || {}
    const [params, setParams] = useState({ ...IParams, page_size: pageSize })
    const [loading, setLoading] = useState(false)
    const [dataSource, setDataSource] = useState([])
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);

    const firstRender = useRef(true);
    const tableRef = useRef();
    const searchRef = useRef();

    const userAction = {
        reload() {
            getDataSource(params);
        },
        cleanSelect() {
            cleanSelectedKeys()
        }

    }

    useEffect(() => {
        //第一次不请求
        if (firstRender.current) {
            firstRender.current = false;
        }
        if (debug) {
            console.debug('params:', params)
        }
        getDataSource(params);
    }, [params])

    // 获取数据
    const getDataSource = async (params = {}) => {
        setLoading(true)
        if (request) {
            let result = await request({ params: JSON.stringify(params), timestamp: Date.now() })
            const { data = {} } = result || {};
            const { list = [] } = data || {};
            // 格式化数据
            setDataSource(data)
        }
        setLoading(false)
    }

    // 清空选择
    const cleanSelectedKeys = () => {
        if (tableRef.current) {
            tableRef.current.clearSelected()
        }
    }

    // 过滤 columns
    let localColumns = columns.filter((item) => {
        if (item.dataIndex && selectedColumns[item.dataIndex]) {
            return selectedColumns[item.dataIndex].show !== false
        } else if (item.hide) {
            return false;
        }
        return true;
    })

    // 默认渲染函数
    const renderText = (value, record, index, column, action) => {
        return value
    }

    /** 组件附加属性 */
    const renderCell = (CellNode, cellProps) => {
        let newCell = CellNode
        if (typeof (CellNode) === 'object') {
            newCell = cloneElement(CellNode, { attrs: cellProps })
        } else if (typeof (CellNode) === 'function') {
            newCell = CellNode({ attrs: cellProps })
        }
        return newCell
    }


    // 额外列
    localColumns.push({
        title: '操作',
        dataIndex: '_option',
        width: 120,
        // 自个渲染操作区
        valueType: <OptionCell menus={options} onChange={onOptionChange} />
    }
    )

    // 重写columns
    localColumns = localColumns.map((item) => {
        const { render: pRender, valueType } = item || {}
        // 重写render函数
        item.render = (value, record, index) => {
            if (typeof (pRender) === 'function') {
                return pRender(value, record, index, item, userAction)
            } else if (valueType) {
                return renderCell(valueType, { value, record, index, column: item, action: userAction })
            } else {
                return renderText(value, record, index, item, userAction)
            }
        }
        // todo:: 附加更多默认属性

        return item;
    })

    // 表格设置
    const renderTableOption = () => {
        const options = {
            reload: {
                text: '重新加载',
                icon: <ReloadOutlined />
            },
            setting: {
                text: '列设置',
                icon: <SettingOutlined />,
            },
        };

        return Object.keys(options).filter((item) => item)
            .map((key) => {
                const option = options[key];
                if (!option) {
                    return null;
                }
                if (key === 'setting') {
                    return <div
                        className="crud-plus-option-item"
                        key={key}
                        style={{ alignItems: 'center', marginRight: '8px' }} >
                        <ColumnSetting
                            option={option}
                            columns={columns}
                            onChange={(columnKeys) => {
                                setSelectedColumns(columnKeys)
                                if (firstRender.current) {
                                    return;
                                }
                            }}
                        /></div>;
                }
                if (key === 'reload') {
                    return <div
                        className="crud-plus-option-item"
                        key={key}
                        style={{ alignItems: 'center', marginRight: '8px' }}
                        onClick={() => {
                            userAction.reload();
                        }}
                    >
                        <a>{option.icon}</a>
                    </div>
                }
            })
    }

    // 工具栏
    const renderToolBar = () => {
        if (typeof (toolBarRender) == 'function') {
            const actions = toolBarRender ? toolBarRender(userAction, { selectedRowKeys, selectedRows }) : []
            return actions.filter((item) => item)
                .map((node, index) => (
                    <div
                        // eslint-disable-next-line react/no-array-index-key
                        key={index}
                        style={{ alignItems: 'center', marginRight: '8px' }}
                    >
                        {node}
                    </div>
                ));
        } else {
            return '';
        }
    }

    return (
        <div className={style.CrudPlusTable}>
            {(searchFields && searchFields.length) ? <SearchForm
                actionRef={searchRef}
                className="crud-plus-search"
                fields={searchFields}
                relation={relation}
                onSearch={(searchValues, searchFields, relation) => {
                    setParams({ ...params, search: searchValues, search_fields: searchFields, relation })
                }}
                onReset={() => { return true; }}
            /> : ''
            }
            <div className="crud-plus-main">
                {showToolbar &&
                    <div className="crud-plus-toolbar" style={{ display: 'flex', marginBottom: '15px' }}>
                        <div style={{ flex: '1 1', fontSize: '1.2em' }} >{title}</div>
                        <div
                            style={{
                                textAlign: 'right',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end'
                            }}>
                            {renderToolBar()}
                        </div>
                        <div style={{ minWidth: '120px', display: 'inline-flex', 'alignItems': 'center', justifyContent: 'flex-end' }}>
                            {renderTableOption()}
                        </div>
                    </div>
                }
                {showAlert && <Alert
                    className="crud-plus-alert"
                    style={{ margin: '0 0px 16px' }}
                    message={
                        <div style={{ display: 'flex' }}>
                            <div style={{ flex: '1 1' }}>
                                {tableAlertRender ? tableAlertRender(selectedRowKeys, selectedRows) :
                                    <span>已选择<a style={{ fontWeight: 600 }}>{' '}{selectedRowKeys.length}</a> 项</span>}
                            </div>
                            <div style={{ minWidth: '48px', 'paddingLeft': '16px' }}><a onClick={cleanSelectedKeys}>清空</a></div>
                        </div>
                    }
                    type="info"
                    showIcon
                />
                }
                <ListTable
                    className="crud-plus-list-table"
                    {...tableProps}
                    rowKey={rowKey}
                    title={undefined}
                    actionRef={tableRef}
                    columns={localColumns}
                    data={dataSource}
                    loading={loading}
                    request={(tableParams) => {
                        if (firstRender.current) {
                            return;
                        }
                        setParams({ ...tableParams, search: params.search || {} })
                    }}
                    onSelectRow={(rowKeys, rows) => {
                        setSelectedRowKeys(rowKeys)
                        setSelectedRows(rows)
                    }}
                />
            </div>
            {
                // otherRender 其它内容渲染,比如表单什么乱七八糟的
                otherRender && otherRender(userAction)
            }
        </div>
    );
};

export default PlusTable;
