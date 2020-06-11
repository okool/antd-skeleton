import { Component } from 'react';
import { Rule } from 'antd/es/form';
import { IconFontProps } from '@ant-design/icons/lib/components/IconFont';
import { Request } from 'umi';


/** Cell组件 */
interface CellComponent {
    (
        /** 当前值  */
        value: any,
        /** 当前行记录 */
        record: object,
        /** 第几行 */
        index: number,
        /** 字段配置 */
        column: TableColumn,
        /** 当前表格 ref */
        action: object,
    ): Component
}

/** 表格过滤枚举值 */
interface ColumnFilter {
    /** 枚举文本 */
    text: string,
    /** 枚举值 */
    value: string | number,
    /** 状态值 */
    status?: 'default' | 'processing' | 'warning' | 'success' | 'error'
}

/**
 * 表格字段属性
 */
interface TableColumn {
    /** 字段标题 */
    title: string,
    /** 字段标识 */
    dataIndex: string,
    /** 是否隐藏 */
    hide?: boolean,
    /** Cell组件类型,默认是text */
    valueType?: CellComponent,
    /** 过滤值 */
    filters?: [ColumnFilter],
    /** 参数antd 表格api */
    [propName: string]: any
}

/** 搜索条件符 */
type SearchCondition = 'in' | 'like' | '>' | '<' | '>=' | '<=' | 'between'

/** 表单渲染函数 */
interface FormRender {
    (value: any, formData: object): Component
}

/** 表单字段 */
interface FormField {
    /** 表单名称,唯一值 */
    name: string,
    /** 标签,在提示,rule会复用 */
    label: string,
    /** 控制提示 */
    placeholder?: string,
    /** 输入规则 */
    rules?: [Rule],
    /** 扩展提示 */
    extra?: string,
    /** 是否显示 标签后的':' */
    colon?: boolean,
    /** 自定义渲染组件,默认是Input控件 */
    render?: FormRender,
}

/**
 * 搜索组件 field 属性
 */
interface SearchField extends FormField {
    /** 表单名称,唯一值 */
    name: string,
    /** 标签,在提示,rule会复用 */
    label: string,
    /** 控制提示 */
    placeholder?: string,
    /** 搜索条件符 */
    condition?: SearchCondition,
    /** 输入规则 */
    rules?: [Rule],
    /** 扩展提示 */
    extra?: string,
    /** 是否显示 标签后的':' */
    colon?: boolean,
    /** 自定义渲染组件,默认是Input控件 */
    render?: FormRender,
}

/** 搜索参数 */
interface ParamsSearch {
    [propName: string]: any
}

/** 搜索条件字段 */
interface ParamsSearchField {
    [propName: string]: SearchCondition
}

/** 排字 */
interface ParamsSearchSorter {
    /** 字段 */
    field: string,
    /** 排序 */
    order: 'asc' | 'desc'
}

/** 过滤条件 */
interface ParamsSearchFilter {
    [propName: string]: [any]
}


/** 请求参数 */
interface QueryParams {
    /** 搜索内容 */
    search?: ParamsSearch,
    /** 搜索字段条件  */
    search_fields?: ParamsSearchField,
    /** 排序条件*/
    sorter?: ParamsSearchSorter,
    /** 过滤条件 */
    filter?: ParamsSearchFilter,
    /** 分页值 */
    page_size?: number,
    /** 当前页 */
    current_page?: number,
    /** 过滤的字段 */
    fields?: [string],
    /** 条件组合关系,默认and */
    relation?: 'and' | 'or',
}

/** 字段排序 */
interface ColumnSorter {
    [propName: string]: 'asc' | 'desc'
}

/**  表格数据 */
interface TableData {
    /** 表格行数据 rows */
    list: [],
    /** 当前页 */
    current_page?: number,
    /** 总条数 */
    total: number,
    /**  */
    per_page: number,
    /** 过滤枚举值 */
    filters: ColumnFilter,
    /** 排序的字段 */
    sorters: ColumnSorter
}

/** 返回内容 */
interface Response {
    /** 状态值,ok:成功,error:业务错误,exception:系统异常 */
    status: 'ok' | 'error' | 'exception',
    /** 错误码 */
    error_code: number,
    /** 提示,根据status来处理 */
    msg: string,
    /** 表格数据 */
    data: TableData,
    /** 异常堆栈 */
    trace?: string,
}

/** 请返返回值 */
interface QueryResponse extends Response {
    /** 状态值,ok:成功,error:业务错误,exception:系统异常 */
    status: 'ok' | 'error' | 'exception',
    /** 错误码 */
    error_code: number,
    /** 提示,根据status来处理 */
    msg: string,
    /** 表格数据 */
    data: TableData,
    /** 异常堆栈 */
    trace?: string,
}

/** Plus请求方法 */
interface PlusRequest {
    <T>(params: QueryParams): QueryResponse
}

/**
 * 表格对外的接口
 */
interface PlusTableAction {
    /** 重新加载 */
    reload: Function,
    /** 清除选择 */
    cleanSelect: Function
}

/** Alter渲染函数 */
interface AlertRender {
    (
        /** 选择keys */
        selectKeys: [],
        /** 选择的行 */
        selectedRows: [],
        /** 当前表格Ref */
        action: PlusTableAction
    ): Component
}

/** 工具栏渲染函数 */
interface ToolBarRender {

    (
        /** 当前表格Ref */
        action: PlusTableAction,
        { selectedKeys: [], selectedRows: [] }
    ): Component
}

/** 其它部分渲染函数 */
interface OtherRender {
    (
        /** 当前表格Ref */
        action: PlusTableAction
    ): Component
}

/** 记录操作菜单 */
interface OptionMemu {
    /** 唯一标识 */
    key: string,
    /** 菜单名 */
    title: string,
    /** 图标 */
    icon?: IconFontProps
}

interface OptionEvent {
    (
        /** 菜单标识 */
        key: string,
        /** 操作的记录 */
        record: object,
        /** 当前表格 Ref */
        action: PlusTableAction
    ): void
}

/** 超级表格的属性 */
interface PlusTableProps {
    /** 获取表格的Ref接口 */
    actionRef: PlusTableAction,
    /** 记录唯一字段,常用id,key, */
    rowKey: string,
    /** 表格字段 */
    columns: [TableColumn],
    /** 搜索表单字段 */
    searchFields: [SearchField],
    /** 请求类 */
    request: PlusRequest,
    /** 搜索默认组合关系,默认and */
    relation?: 'and' | 'or',
    /**  */
    bordered?: '',
    /** 表格名称 */
    title?: string,
    /** 控制台,调试 */
    debug?: boolean,
    /** 默认分页数 */
    pageSize?: number,
    /** 过长省略 */
    ellipsis?: boolean,
    /** 是否显示表头 */
    showHeader?: boolean,
    /** 是否显示中间的提示 */
    showAlert?: boolean,
    /** 自定义提示栏 */
    tableAlertRender: AlertRender,
    /** 是否显示工具栏 */
    showToolbar?: boolean,
    /** 显示表格序号 */
    showAutoIndex?: boolean,
    /** 选择类型 */
    selectionType?: 'radio' | 'checkbox',
    /** 工具栏渲染函数 */
    toolBarRender?: ToolBarRender,
    /** 其它内容渲染,比如弹框 */
    otherRender?: OtherRender,
    /** 记录操作菜单  */
    options?: [OptionMemu],
    /** 记录操作区事件 */
    onOptionChange?: OptionEvent
}

/** 表单接口 */
interface EditFormAction {
    show: (DefaultValues: {}) => void
    hide: Function,
}

/** 提交成功回调事件 */
interface PostSuccessCallback {
    (action: EditFormAction, response: Response): void
}

/** 表单验证完成提交事件 */
interface SubmitEvent {
    (values: object, action: EditFormAction): void
}

/** 表单变更事件 */
interface FormChangeEvent {
    (
        /** 当前变更字段 */
        value: object, action: EditFormAction): void
}

/** 编辑表单属性 */
interface EditModalProps {
    /** 表格的ref */
    actionRef?: object,
    /** 表单字段属性 */
    fields: [FormField],
    /** 标题 */
    title: string,
    /** 提交按扭 */
    submitText?: string,
    /** 正在提交的按扭 */
    loadingText?: string,
    /** 重置的文案 */
    resetText?: string,
    /** 网络请求 */
    request: Request,
    /** 成功回调 */
    onSuccess: PostSuccessCallback,
    /** 表单提交事件 */
    onSubmit: SubmitEvent,
    /** 表单变更事件,可用于联动 */
    onChange: FormChangeEvent,
    /** 开启调试 */
    debug: boolean
}

