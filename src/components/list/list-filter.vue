<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import useLoading from '@/hooks/loading';
  import type { IColumn } from './types';

  export interface IProps {
    col: IColumn;
    hiddenListFilter: () => void;
  }
  type IOption = { text: string; value: string | number };
  type IOptions = IColumn['filters'];

  const props = withDefaults(defineProps<IProps>(), {});
  const emits = defineEmits(['update:filter']);

  const { loading, setLoading } = useLoading();

  // all options = col.filters/ fetchOptions
  const fetchOptions = ref<IOptions>([]);
  const filteredOptions = ref<IOptions>([]);
  const selectedValues = ref<(string | number)[]>([]);
  const searchKeyword = ref('');

  type IGroups = {
    selected: IOptions;
    unselected: IOptions;
  };
  type IInsertedConditionCallback = (
    curr: IOption,
    currIdx?: number,
    origin?: IOptions
  ) => boolean;

  const handleRecombineOptions = (
    recombineOptions?: IOptions,
    insertedConditionCallback?: IInsertedConditionCallback
  ): void => {
    setLoading(true);
    const recombineGroups = recombineOptions?.reduce<IGroups>(
      (target, curr, idx, origin) => {
        // check extra condition, checkInsertCondition has initial value
        if (!insertedConditionCallback?.(curr)) {
          return target;
        }
        if (selectedValues.value.includes(curr.value)) {
          // todo map 查找更快
          target.selected?.push(curr);
        } else {
          target.unselected?.push(curr);
        }
        return target;
      },
      {
        selected: [],
        unselected: [],
      }
    );
    // 重新组合，已选择 -> 未选择
    filteredOptions.value = [
      ...(recombineGroups?.selected || []),
      ...(recombineGroups?.unselected || []),
    ];
    setLoading(false);
  };

  // why: ordinary objs are wrapped proxy when reduce execute
  const handleUnrecombineOptions = (
    unRecombineOptions?: IOptions,
    insertedConditionCallback?: IInsertedConditionCallback
  ): void => {
    setLoading(true);

    // filtered options recombine
    unRecombineOptions ||= fetchOptions.value;
    insertedConditionCallback ||= () => true;

    const { filterLimitSize = unRecombineOptions?.length || 0 } = props.col;

    const unrecombineGroups = unRecombineOptions?.reduce<IOptions>(
      (target, curr) => {
        if (target!.length >= filterLimitSize) {
          return target;
        }

        if (!insertedConditionCallback?.(curr)) {
          return target;
        }

        target?.push(curr);
        return target;
      },
      []
    );

    // 非重组
    filteredOptions.value = [...(unrecombineGroups || [])];

    setLoading(false);
  };

  const handleSearchOptions = (keyword?: string): void => {
    // search and recombine fetchOptions/allOptions, and insertedCondition is text indludes keyword
    keyword = keyword?.trim();
    handleUnrecombineOptions(fetchOptions.value, (option) => {
      if (keyword === undefined) return true;
      return option.text.includes(keyword);
    });
  };

  const handleReset = () => {
    selectedValues.value = [];
    searchKeyword.value = '';
    emits('update:filter', selectedValues.value);
    handleUnrecombineOptions();
    props.hiddenListFilter?.();
  };

  const initOptions = async () => {
    const { col } = props; // col: { filters, filterRequest }
    const { filterRequest } = col;

    setLoading(true);
    // netword
    const emptyTip = col.filterEmpty ? [col.filterEmpty] : [];

    if (filterRequest) {
      try {
        const options = [...emptyTip, ...((await filterRequest([])) || [])];
        fetchOptions.value = options;
        filteredOptions.value = [...(options || [])];
      } catch {
        //
      }
    } else {
      // static value
      fetchOptions.value = [...emptyTip, ...(col.filters || [])];
      filteredOptions.value = [...emptyTip, ...(col.filters || [])];
    }

    // reason: prop has default selected options
    // handleRecombineOptions()
    handleUnrecombineOptions();
    setLoading(false);
  };
  initOptions();

  watch(selectedValues, (value) => {
    emits('update:filter', value);
  });
  // const init = () => {}
</script>

<template>
  <a-card style="width: 200px; overflow-x: hidden" class="list-filter">
    <template #title>
      <div style="font-size: 12px">
        {{ $t('list.list-filter.selected') }}: {{ selectedValues?.length }}
      </div>
    </template>

    <template #extra>
      <a-button size="mini" @click="handleReset">
        <!-- {{ selectedValues?.length }}  -->
        {{ $t('list.list-filter.button.clear.text') }}
      </a-button>
    </template>

    <a-space class="list-filter__search">
      <a-input
        v-model="searchKeyword"
        :placeholder="`${$t('list.list-filter.input.placeholder.prefix')}${$t(
          col.title
        )}${$t('list.list-filter.input.placeholder.suffix')}`"
        allow-clear
        size="mini"
        @input="(keyword) => handleSearchOptions(keyword)"
        @clear="() => handleSearchOptions()"
      />
    </a-space>
    <!-- :loading="loading" -->
    <a-list :bordered="false" :max-height="400" class="list-filter__content">
      <a-checkbox-group
        v-if="filteredOptions?.length"
        v-model="selectedValues"
        direction="vertical"
        style="margin: 0 18px"
      >
        <a-checkbox
          v-for="item in filteredOptions"
          :key="item.text"
          :value="item.value"
        >
          <a-tooltip :content="item.text" mini>
            <div
              style="
                max-width: 128px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              "
            >
              {{ item.text }}
            </div></a-tooltip
          >
        </a-checkbox>

        <div v-if="col?.filterLimitSize" class="list-filter__content-tip">
          默认展示{{ col?.filterLimitSize }}条，更多请搜索
        </div>
      </a-checkbox-group>
    </a-list>
  </a-card>
</template>

<style lang="less">
  .list-filter {
    .arco-card-header {
      height: 40px;
      padding: 0 16px;
      border-bottom: none;
    }

    .arco-card-body {
      /* padding: 8px 16px; */
      padding: 0;
    }

    &__search {
      margin: 0 auto;
      padding: 8px 18px;
      padding-top: 0;
      border-bottom: 1px solid var(--color-neutral-3);
    }

    &__content {
      &-tip {
        margin: 8px 0;
        color: rgb(59 62 69 / 60%);
        font-size: 12px;
        text-align: center;
      }
    }
  }
</style>
