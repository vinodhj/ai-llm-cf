import { useEffect, forwardRef, useImperativeHandle } from "react";

interface TurnstileWidgetProps {
  siteKey: string;
  setTurnstileToken: (token: string) => void;
  isCaptchaHighlighted: boolean;
  setIsCaptchaHighlighted: (highlight: boolean) => void;
  setErrorMessage: (message: string) => void;
}

const TurnstileWidget = forwardRef(({
  siteKey,
  setTurnstileToken,
  isCaptchaHighlighted,
  setIsCaptchaHighlighted,
  setErrorMessage
}: TurnstileWidgetProps, ref) => {

  useEffect(() => {
    const renderTurnstile = () => {
      const widgetContainer = document.querySelector('#myWidget');
      if (widgetContainer && widgetContainer.children.length === 0) {
        window.turnstile.render('#myWidget', {
          sitekey: siteKey,
          theme: 'light',
          callback: (token: string) => {
            setTurnstileToken(token);
            setIsCaptchaHighlighted(false);
            setErrorMessage("");
          },
        });
      }
    };

    if (typeof window.turnstile === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      script.onload = renderTurnstile;
      document.body.appendChild(script);
    } else {
      renderTurnstile();
    }
  }, [siteKey, setTurnstileToken, setIsCaptchaHighlighted, setErrorMessage]);

  // Expose a reset function to parent component
  useImperativeHandle(ref, () => ({
    resetTurnstile() {
      if (typeof window.turnstile !== 'undefined') {
        window.turnstile.reset('#myWidget');
      }
    },
  }));

  return (
    <div
      id="myWidget"
      className={`turnstile-widget ${isCaptchaHighlighted ? "highlight" : ""}`}
    ></div>
  );
});

export default TurnstileWidget;
