import axios, { AxiosResponse } from "axios";
import { useState } from "react";

// import useFeedbackAlertStore  from "../../stores/useFeedbackAlertStore";

const useAxios = () => {
  type ResponseType<T = unknown> = AxiosResponse<T, unknown> | null;

  const [response, setResponse] = useState<ResponseType>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  // const { showFeedback } = useFeedbackAlertStore();

  const BASEURI = "https://api.thesocialist.lk:3000";

  const Instance = axios.create({
    baseURL: BASEURI,
    timeout: 10000, 
  });

  interface AxiosTypes {
    url: string;
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    data?: Record<string, unknown>;
    headers?: Record<string, string>;
  }

  const AxiosRequest = async ({
    url,
    method,
    data = {},
    headers = {},
  }: AxiosTypes) => {
    setLoading(true);

    try {
      const token = await localStorage.getItem("token");
      // console.log("Token from AsyncStorage:", token);
      const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

      const _headers = {
        "Content-Type": "application/json",
        Accept: "*",
        ...headers,
        ...authHeader,
      };

      const result = await Instance({
        url,
        method,
        data,
        headers: _headers,
      });

      console.log("Axios response:", {
        status: result.status,
        data: result.data,
      });

      setResponse(result);
      return result;
    } catch (err: unknown) {
      console.log("Axios error:", err);

      if (axios.isAxiosError(err)) {
        if (err.code === "ECONNABORTED") {
          console.log("Request timed out");
          throw new Error("Request timed out");
        } else if (err.response) {
          const errorMessage =
            err.response.data?.message || "An error occurred";
          console.log("Error response:", errorMessage);

          setError(errorMessage);
          // showFeedback(errorMessage, "failed");
          throw new Error(errorMessage);
        } else {
          console.log("Network error. Check your connection.");
          throw new Error("Network error. Check your connection.");
        }
      } else {
        console.log("Unknown error:", err.message);
        throw new Error(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    response,
    error,
    loading,
    AxiosRequest,
  };
};

export default useAxios;
