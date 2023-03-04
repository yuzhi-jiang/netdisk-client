import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default function useInput() {
  const $router = useRouter();
  const content = ref('');
  const clearInput = () => {
    $router.push({
      name: 'file.all',
    });
  };
  const okSearch = (str: string) => {
    str = str.trim();
    if (str) {
      $router.push({
        name: 'file.all',
        query: {
          search: str,
        },
      });
    } else clearInput();
  };

  return {
    content,
    clearInput,
    okSearch,
  };
}
