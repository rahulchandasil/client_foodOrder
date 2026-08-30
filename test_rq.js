import { QueryClient, useMutation } from '@tanstack/react-query';
import { renderHook, act } from '@testing-library/react-hooks';

const queryClient = new QueryClient();

async function runTest() {
  let errorCaught = false;

  const { result, waitFor } = renderHook(() => useMutation({
    mutationFn: async () => {
      return { success: true };
    },
    onSuccess: () => {
      throw new Error("Error in onSuccess");
    },
    onError: (err) => {
      errorCaught = true;
      console.log("onError was called!");
    }
  }));

  try {
    await act(async () => {
      result.current.mutate();
    });
  } catch (e) {
    console.log("mutate threw error:", e.message);
  }

  console.log("errorCaught in onError:", errorCaught);
}

runTest();
