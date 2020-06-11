import React, { useState, useRef, useEffect } from 'react';
import ProTable from '@ant-design/pro-table';

const SelectLang = props => {
    // 重置
    let { columns = [], request, onChange, onSubmit, params, ...LProps } = props || {};
    const [search, setSearch] = useState({});
    const [filter, setFilter] = useState({});
    const [sorter, setSorter] = useState({});
    const [lColumns, setColumns] = useState(undefined);
    const [sorters, setSorters] = useState(undefined);
    const [filters, setFilters] = useState(undefined);
    const actionRef = useRef();
    useEffect(() => {
        console.log('变了')
        columns = columns.map((column) => {
            if (sorters && column.dataIndex in sorters) {
                column.sorter = sorters[column.dataIndex]
            }
            if (filters && column.dataIndex in filters) {
                column.filters = filters[column.dataIndex]
            }
            return column;
        })
        setColumns(columns);
    }, [sorters, filters])

    return <ProTable
        {...LProps}
        actionRef={actionRef}
        columns={lColumns}
        params={{
            sorter,
            search,
            filter
        }}
        request={async (params = {}) => {
            // 重写querys
            const { request } = props;
            const { current, pageSize, sorter, search, filter } = params || {};
            const tableData = {
                data: [],
                current: 1,
                total: 0,
                pageSize: 20,
            };

            if (!request) {
                return tableData;
            }
            const response = await request({ current, page_size: pageSize, search, filter, sorter });
            const { error_code, status, msg, data = {} } = response || {};
            if (!response || !data) {
                return tableData;
            }
            // 重写返回值
            const { list = [], sorters = {}, filters = {}, total = 0, per_page = 20, current_page = 1 } = data || {}

            // 生成 filter 和 sorter
            if (status === 'ok') {
                if (sorters) {
                    setSorters(sorters)
                }
                if (filters) {
                    setFilters(filters)
                }
            }

            return {
                data: list,
                total: total,
                current: current_page,
                pageSize: per_page
            }
        }}
        onChange={(params, _filter, _sorter, ) => {
            const filter = {};
            for (let f in _filter) {
                if (_filter[f]) { filter[f] = _filter[f] };
            }
            if (filter && Object.keys(filter).length > 0) {
                setFilter(filter)
            }
            if (_sorter && _sorter.order) {
                setSorter({
                    field: _sorter.field,
                    order: _sorter.order === 'descend"' ? 'desc' : 'asc',
                })
            }

        }}
        onSubmit={(formData) => {
            setSearch(formData)
        }}

    />
}

export default SelectLang;