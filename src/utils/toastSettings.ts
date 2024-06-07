import { Theme, ToastPosition } from "react-toastify"

export const toastSettings = {
  position: "bottom-center" as ToastPosition,
  autoClose: 4000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "dark" as Theme,
  pauseOnFocusLoss: true,
  rtl: false,
}
