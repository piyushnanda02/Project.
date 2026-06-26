import React, { Suspense } from "react";

const LazyComponent = React.lazy(() => import("./components/LazyComponent"));

function App() {
  return (
    <div>
      <h1>Lazy Loading + Form Validation</h1>

      <Suspense fallback={<h3>Loading...</h3>}>
        <LazyComponent />
      </Suspense>
    </div>
  );
}

export default App;