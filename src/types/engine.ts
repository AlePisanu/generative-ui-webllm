export interface UIBlock {
    type:
    | "card"
    | "alert"
    | "list"
    | "chart"
    | "form"
    | "stat"
    | "image_placeholder"
    | "text";
    props: Record<string, unknown>;
}

export interface LLMResponse {
    message: string;
    ui?: UIBlock[];
}

export type Phase = "loading" | "ready";

export interface Message {
    role: "user" | "assistant";
    content: string;
    ui?: LLMResponse["ui"];
}