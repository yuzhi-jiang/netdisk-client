import { useUserStore } from '@/store';
import { putOtherShares } from '@/api/shares';

export default function useTrasnfer() {
  const userStore = useUserStore();

  const transfer = async (initData: { selectedKey: string[] }) => {
    // await putOtherShares()
  };

  return { transfer };
}
