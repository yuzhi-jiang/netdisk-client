<script lang="tsx" setup>
  import { ref, reactive, computed, toRefs } from 'vue';
  import { Message, Modal, Table } from '@arco-design/web-vue';
  import { IconList, IconApps, IconFilter } from '@arco-design/web-vue/es/icon';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import type {
    TableRowSelection,
    TableExpandable,
  } from '@arco-design/web-vue/es/table';
  import { Pagination } from '@/types/global';
  import {
    IAction,
    IColumn,
    ActionInputRecord,
    isInputAction,
    isButtonAction,
  } from './types';
  import ListFilter from './list-filter.vue';

  export interface ListProp {
    request: (
      params?: Record<string, any>
    ) => Promise<{ data: any[]; total: number }>;
    beforeRequest?: () => Promise<void>;
    columns: IColumn[];
    toolbar: IAction[];
    actions: IAction[];
    scroll?: {
      x?: number | string;
      y?: number | string;
      minWidth?: number | string;
      maxHeight?: number | string;
    };
    rowKey?: string;
    rowSelection?: TableRowSelection | boolean;
    expandable?: TableExpandable;
  }

  const { t } = useI18n();

  const defaultRowSelection: TableRowSelection = {
    type: 'checkbox',
    showCheckedAll: true,
    selectedRowKeys: [],
  };

  const props = withDefaults(defineProps<ListProp>(), {
    request: async () => ({ data: [], total: 0 }),
    columns: () => [],
    toolbar: () => [],
    actions: () => [],
    rowKey: 'id',
    rowSelection: true,
  });

  const rowSelection = computed<TableRowSelection | undefined>(() => {
    if (typeof props.rowSelection === 'boolean') {
      if (props.rowSelection) {
        return defaultRowSelection;
      }
      return undefined;
    }
    return props.rowSelection;
  });

  const emits = defineEmits(['action']);

  const { loading, setLoading } = useLoading(true);

  const tableRef = ref<InstanceType<typeof Table>>();
  const renderData = ref<any[]>([]);

  const basePagination: Pagination = {
    current: 1,
    pageSize: 20,
    total: 0,
    showTotal: true,
    showPageSize: true,
    defaultPageSize: 10,
    pageSizeOptions: [10, 20, 50],
  };

  const pagination = reactive({
    ...basePagination,
  });

  const selectedKeys = ref<(string | number)[]>([]);

  const { columns, toolbar, actions, rowKey, scroll } = toRefs(props);

  // Handle Search
  const inputToolbar = toolbar.value.find(isInputAction);

  const queryForm = reactive<{
    search: Record<string, string>;
    sort: Record<string, string>;
    filter: Record<string, string>;
  }>({ search: {}, sort: {}, filter: {} });

  const oprationsColumnWidth = computed(() => {
    return actions.value.length * 80;
  });

  const handleQueryForm = () => {
    if (inputToolbar) {
      queryForm.search[inputToolbar.key] =
        inputToolbar.defaultValue?.trim() || '';
    }
    columns.value.forEach((item) => {
      if (item.sortable && item.defaultSortOrder) {
        queryForm.sort[item.prop] = item.defaultSortOrder;
      }
    });
  };

  const handleSortQuery = () => {
    const sortQuery = Object.keys(queryForm.sort)
      .map((item) => {
        if (queryForm.sort[item]) {
          return `${item} ${
            queryForm.sort[item] === 'descend' ? 'desc' : 'asc'
          }`;
        }
        return undefined;
      })
      .filter((item) => !!item)
      .join();

    // console.log(sortQuery.join());
    return { order: sortQuery };
  };

  const reload = async () => {
    const { current, pageSize } = pagination;

    queryForm.search = Object.keys(queryForm.search).reduce<
      Record<string, string>
    >((target, curr) => {
      target[curr] = queryForm.search[curr].trim();
      return target;
    }, {});

    const params = {
      ...queryForm.search,
      ...handleSortQuery(),
      ...queryForm.filter,
      page: current,
      pageSize,
    };
    try {
      setLoading(true);
      const res = await props.request(params);
      renderData.value = res.data;
      pagination.total = res.total;
    } catch (error) {
      //
    } finally {
      setLoading(false);
    }
  };

  const reset = async () => {
    pagination.current = 1;
    reload();
  };

  const setSelectAll = (checked: boolean) => {
    tableRef.value?.selectAll(checked);
  };

  const onFilter = () => {
    return true;
  };

  const onFilterChange = (dataIndex: string, filteredValues: string[]) => {
    queryForm.filter[dataIndex] = filteredValues.join(',');
    reload();
  };

  const onSortChange = (dataIndex: string, direction: string) => {
    queryForm.sort = {};
    queryForm.sort[dataIndex] = direction;
    reload();
  };

  const onPageChange = (page: number) => {
    pagination.current = page;
    reload();
  };

  const onPageSizeChange = (pageSize: number) => {
    pagination.current = 1;
    pagination.pageSize = pageSize;
    reload();
  };
  const onRowClick = (record: any, ev: Event) => {
    emits('action', { action: { key: 'rowClick' }, record, ev });
  };

  const onAction = async ({
    action,
    record,
  }: {
    action: IAction;
    record: any;
  }) => {
    if (isButtonAction(action)) {
      // no seleced
      if (action.bulk && !selectedKeys.value.length) {
        Message.warning(t('list.actions.warning.noSelected'));
        return;
      }

      if (action.confirm) {
        Modal.confirm({
          title: t('list.actions.confirm.info'),
          content: t(action.confirmText || ''),
          okText: t('modal.okText'),
          cancelText: t('modal.cancelText'),
          onOk: () => {
            emits('action', {
              action,
              record,
              selectedKeys: selectedKeys.value,
            });
          },
        });
      } else {
        emits('action', { action, record, selectedKeys: selectedKeys.value });
      }
    } else if (isInputAction(action)) {
      emits('action', {
        action,
        record: record as ActionInputRecord,
        selectedKeys: selectedKeys.value,
      });
    } else {
      emits('action', { action, record, selectedKeys: selectedKeys.value });
    }
  };

  const init = async () => {
    if (props.beforeRequest) {
      await props.beforeRequest();
    }
    handleQueryForm();
    reload();
  };

  init();

  defineExpose({
    reload,
    reset,
    setSelectAll,
  });
</script>

<template>
  <a-card class="netdisk-list">
    <div class="toolbar">
      <a-space fill style="width: 100%">
        <template
          v-for="action in toolbar.filter(isButtonAction)"
          :key="action.key"
        >
          <slot :name="action.key" :on-action="onAction" :action="action">
            <a-button-group>
              <a-button
                :type="action.type || 'primary'"
                :status="action.status || 'normal'"
                @click="onAction({ action, record: null })"
              >
                <template #icon>
                  <component :is="action.icon" />
                </template>
                {{ $t(`list.toolbar.${action.key}`) }}
              </a-button>

              <a-trigger trigger="click" :unmount-on-close="true">
                <a-button
                  v-if="action.trigger"
                  :type="action.type || 'primary'"
                  :status="action.status || 'normal'"
                >
                  <template #icon>
                    <icon-more />
                  </template>
                </a-button>
                <template #content>
                  <div class="list-toolbar-trigger__content">
                    <component :is="action.triggerContent" />
                  </div>
                </template>
              </a-trigger>
            </a-button-group>
          </slot>
        </template>
      </a-space>
      <a-input-group v-if="inputToolbar">
        <!-- 使用插槽，并拓展onAction，可以保留以前写法而无需修改 -->
        <slot
          :name="inputToolbar.key"
          :on-action="onAction"
          :action="inputToolbar"
        >
          <a-input-search
            v-model="queryForm.search[inputToolbar.key]"
            :style="{ width: '280px', marginLeft: '8px' }"
            :placeholder="$t(inputToolbar.placeholder || '')"
            search-button
            allow-clear
            @press-enter="reload"
            @clear="reload"
            @search="reload"
          />
        </slot>
      </a-input-group>
    </div>
    <a-table
      ref="tableRef"
      v-model:selectedKeys="selectedKeys"
      v-model:pagination="pagination"
      :row-key="rowKey"
      :loading="loading"
      :data="renderData"
      :expandable="expandable"
      :row-selection="rowSelection"
      :scroll="scroll"
      :bordered="false"
      width="100%"
      page-position="bottom"
      column-resizable
      @page-change="onPageChange"
      @page-size-change="onPageSizeChange"
      @sorter-change="onSortChange"
      @row-click="onRowClick"
    >
      <!-- @filter-change="onFilterChange" -->
      <template #columns>
        <a-table-column
          v-for="col in columns"
          :key="col.prop"
          :title="$t(col.title)"
          :data-index="col.prop"
          :sortable="{
            sorter: true,
            sortDirections: col.sortable === true ? ['ascend', 'descend'] : [],
            defaultSortOrder: col.defaultSortOrder || '',
          }"
          :filterable="
            col.filterable === true
              ? {
                  filters: [],
                  filter: onFilter,
                  multiple: true,
                  alignLeft: true,
                  triggerProps: {
                    unmountOnClose: false, // must
                  },
                }
              : undefined
          "
          :width="col.width"
          ellipsis
          tooltip
        >
          <template #cell="{ record, rowIndex }">
            <slot
              :name="col.prop"
              :row="record[col.prop]"
              :row-index="rowIndex"
              :record="record"
            >
              {{
                col.formatter
                  ? typeof col.formatter === 'function'
                    ? col.formatter(record[col.prop], rowIndex, record)
                    : col.formatter
                  : record[col.prop]
              }}
            </slot>
          </template>

          <template #filter-icon>
            <IconFilter
              :style="{
                color: queryForm.filter[col.prop]?.length
                  ? 'rgb(var(--primary-6))'
                  : '',
              }"
            ></IconFilter>
          </template>

          <!-- 必须v-if，否则无法无法正确渲染数据，为了保证empty，增加a-list空状态 -->
          <template #filter-content="{ handleFilterReset }">
            <ListFilter
              v-if="col.filters?.length || col.filterRequest"
              :col="col"
              :hidden-list-filter="handleFilterReset"
              @update:filter="(selectedValues: string[]) => onFilterChange(col.prop, selectedValues)"
            />
            <a-card v-else style="min-width: 200px">
              <a-list :bordered="false"></a-list>
            </a-card>
          </template>
        </a-table-column>
        <a-table-column
          v-if="actions.length"
          :title="$t('list.columns.operations')"
          data-index="operations"
          fixed="right"
          align="center"
          :width="oprationsColumnWidth"
        >
          <template #cell="{ record }">
            <a-button
              v-for="action in actions
                .filter(isButtonAction)
                .filter(
                  (item) =>
                    !(typeof item.hidden === 'function'
                      ? item.hidden(record)
                      : item.hidden)
                )"
              :key="action.key"
              type="text"
              size="small"
              :status="action.status || 'normal'"
              @click="onAction({ action, record })"
            >
              {{ $t(`list.columns.operations.${action.key}`) }}
            </a-button>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </a-card>
</template>

<style lang="less">
  .toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  /* stylelint 检测错误，可能是双下划线的原因，且stylelint无法禁止 */
  .list-toolbar-trigger__content {
    width: 500px;
    padding: 10px;
    background-color: var(--color-bg-popup);
    border-radius: 4px;
    box-shadow: 0 2px 8px #000026;
  }

  .netdisk-list
    .arco-icon-hover.arco-table-filters.arco-table-filters-open.arco-table-filters-align-left {
    background: none;
  }
</style>
