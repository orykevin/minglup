import { useMutation } from "convex/react";
import { FunctionArgs, FunctionReference, FunctionReturnType } from "convex/server";
import { useCallback, useState } from "react";

export const useConvexMutation = <
    Mutation extends FunctionReference<"mutation">,
>(
    mutationFunction: Mutation
) => {
    const [isPending, setIsPending] = useState(false);
    const mutation = useMutation(mutationFunction);

    const mutate = useCallback(
        async (
            values: FunctionArgs<Mutation>,
            options?: {
                onSuccess?: (res: FunctionReturnType<Mutation>) => void;
                onError?: (error: { data: string }) => void;
                onSettled?: () => void;
                throwError?: boolean;
            }
        ): Promise<FunctionReturnType<Mutation> | undefined> => {
            try {
                setIsPending(true);
                const response = await mutation(values);
                options?.onSuccess?.(response);
                return response;
            } catch (error) {
                options?.onError?.(error as { data: string });
                if (options?.throwError) {
                    throw error;
                }
            } finally {
                setIsPending(false);
                options?.onSettled?.();
            }
        },
        [mutation]
    );

    return { mutate, isPending };
};