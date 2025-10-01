import { useMemo, type CSSProperties } from 'react';
import { createHashHistory, type History, type Listener } from 'history';
import { Studio } from 'sanity';
import config from '../sanity/sanity.config';

const containerStyle: CSSProperties = {
  height: '100vh',
  maxHeight: '100dvh',
  overscrollBehavior: 'none',
  WebkitFontSmoothing: 'antialiased',
  overflow: 'hidden',
};

const SanityStudioWrapper = ({
  routerHistory = 'browser',
}: {
  routerHistory?: 'browser' | 'hash';
}) => {
  const history = useMemo<History | undefined>(() => {
    if (routerHistory !== 'hash') {
      return undefined;
    }

    const baseHistory = createHashHistory();

    return {
      get action() {
        return baseHistory.action;
      },
      get location() {
        return baseHistory.location;
      },
      get createHref() {
        return baseHistory.createHref;
      },
      get push() {
        return baseHistory.push;
      },
      get replace() {
        return baseHistory.replace;
      },
      get go() {
        return baseHistory.go;
      },
      get back() {
        return baseHistory.back;
      },
      get forward() {
        return baseHistory.forward;
      },
      get block() {
        return baseHistory.block;
      },
      listen(listener: Listener) {
        return baseHistory.listen(({ location }) => {
          // The history typings differ slightly from what Sanity expects, so we adapt the callback signature.
          listener(location as any);
        });
      },
    } satisfies History;
  }, [routerHistory]);

  return (
    <div data-ui='AstroStudioLayout' style={containerStyle}>
      <Studio config={config} unstable_history={history} />
    </div>
  );
};

export default SanityStudioWrapper;
