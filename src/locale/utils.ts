/**
 *
 * @param name like zh-CN
 * @returns locale {}
 */
export function importAllLocale(name: 'zh-CN' | 'en-US') {
  // const path = `@/components/**/${name}.ts` as string; // vite-plugin-import-meta:error, import.meta.glob path 必须是静态字符串
  let languages: any;
  if (name === 'zh-CN') {
    languages = import.meta.glob('@/components/**/zh-CN.ts', {
      eager: true,
    });
  } else if (name === 'en-US') {
    languages = import.meta.glob('@/components/**/en-US.ts', {
      eager: true,
    });
  }
  return Object.keys(languages).reduce((target, key) => {
    const module = languages[key].default;
    return { ...target, ...module };
  }, {} as any);
}

export default {
  importAllLocale,
};
