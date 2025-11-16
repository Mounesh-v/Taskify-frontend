import { toast } from "react-toastify";

export const showIndigoToast = (message, type = "success") => {
  const baseStyle = {
    background: "#ffffff",
    color: "#4F46E5",
    fontWeight: "600",
    borderRadius: "10px",
    padding: "12px 16px",
  };

  const options = {
    position: "top-right",
    style: baseStyle,
  };

  if (type === "success") return toast.success(message, options);
  if (type === "error") return toast.error(message, options);
  if (type === "warn") return toast.warn(message, options);
  if (type === "info") return toast.info(message, options);

  return toast(message, options);
};
