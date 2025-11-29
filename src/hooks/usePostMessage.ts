import { useQuery } from "@tanstack/react-query";

interface PostMessageData {
    type: string;
    data: {
        token: string;
        app_session_id: string;
    };
}
interface PostMessageResponse {
    token: string;
    app_session_id: string;
}

/**
 * Hook to listen for postMessage from parent window (iframe)
 */
export const usePostMessage = () => {
    const queryEvents = useQuery<PostMessageResponse>({
        queryKey: ["postMessage"],
        queryFn: () => {
            return new Promise((resolve) => {
                const handleMessage = (event: MessageEvent<PostMessageData>) => {
                    if (event.data?.type === "START_EVENT") {
                        const { token, app_session_id } = event.data.data as PostMessageResponse;
                        if (token && app_session_id) {
                            console.log("START_EVENT")
                            resolve({ token, app_session_id });
                            window.parent.postMessage({
                                type: "STOP_EVENT",
                            }, import.meta.env.VITE_URL_PARENT);
                        }
                    }
                };
                window.addEventListener("message", handleMessage);
                return () => {
                    window.removeEventListener("message", handleMessage);
                };
            });
        },
    })

    return {
        token: queryEvents.data?.token ||"",
        appSessionId: queryEvents.data?.app_session_id ||""
    };
};

