import {
    ITimeBlock,
    TCreateTimeBlockInputDefinition,
    TUpdateTimeBlockInputDefinition,
    TUpdateTimeBlockParamsDefinition,
} from "@spin-spot/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";

export async function createTimeBlock(input: TCreateTimeBlockInputDefinition) {
    const res = await api.post("/timeblock", { body: input });
    const timeBlock: ITimeBlock = await res.json();
    return timeBlock;
}

export function useCreateTimeBlock() {
    return useMutation({ mutationKey: ["createTimeBlock"], mutationFn: createTimeBlock });
}

export async function updateTimeBlock({
    _id,
    ...input
}: {
    _id: TUpdateTimeBlockParamsDefinition["_id"];
} & TUpdateTimeBlockInputDefinition) {
    const res = await api.put("/timeblock/" + encodeURIComponent(`${_id}`), { body: input });
    const timeBlock: ITimeBlock = await res.json();
    return timeBlock;
}

export function useUpdateTimeBlock() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["updateTimeBlock"],
        mutationFn: updateTimeBlock,
        onSuccess(data) {
            queryClient.invalidateQueries({ queryKey: ["getTimeBlock", data._id] });
            queryClient.invalidateQueries({ queryKey: ["getTimeBlocks"] });
        },
    });
}
