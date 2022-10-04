import { createEffect, createSignal, onCleanup } from "solid-js"
import { type JSX } from "solid-js/jsx-runtime"

interface WindowProps {
  url: string
  title: string
  width: number
  height: number
}

interface OauthPopupProps {
  url: string
  title?: string
  width?: number
  height?: number
  onClose?: () => void
  onCode: (code: string, params: URLSearchParams) => void
  children: JSX.Element
}

const createPopUp = (props: WindowProps) => {
  const { url, title, width, height } = props

  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2.5;
  const externalPopup = window.open(
    url,
    title,
    `width=${width},height=${height},left=${left},top=${top}`,
  );
  return externalPopup;
}

const OauthPopup = (props: OauthPopupProps) => {
  const { 
    title = '',
    width = 500,
    height = 500,
    url,
    children,
    onClose,
    onCode
  } = props

  const [externalWindow, setExternalWindow] = createSignal<Window | null>()

  const [intervalRef, setIntervalRef] = createSignal<number | null>()

  const clearTimer = () => {
    const interval = intervalRef()

    if (!interval)
      return

    window.clearInterval(interval)
  }

  const handleOpen = () => {
    setExternalWindow(createPopUp({
      url, title, width, height
    }))
  }

  createEffect(() => {
    const windowVal = externalWindow()

    if (!windowVal)
      return

    setIntervalRef(window.setInterval(() => {
      try {
        const currentUrl = windowVal.location.href;
        const params = new URL(currentUrl).searchParams;
        const code = params.get('code');
        if (!code) {
          return;
        }
        onCode(code, params);
        clearTimer();
        windowVal.close();
      } catch (error) {
        console.error(error)
      } finally {
        if (!windowVal || windowVal.closed) {
          onClose?.();
          clearTimer();
        }
      }
    }, 700))
  })

  onCleanup(() => {
    externalWindow()?.close();
    onClose?.()
  })

  return (
    <div
      onClick={handleOpen}>
      {children}
    </div>
  )
}

export default OauthPopup