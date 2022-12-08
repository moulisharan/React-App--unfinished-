import React, { lazy, Suspense } from "react";
import useAuth from "atoms/hooks/useAuth";

const PreLogin = lazy(() => import("components/preLogin/PreLogin"));
const PostLogin = lazy(() => import("components/postLogin/PostLogin"));

const App = () => {
  const { isLoggedIn } = useAuth();
  console.log(isLoggedIn)
  return (
    <Suspense fallback={<div>Loading</div>}>

      {/* <Choose>
        <When condition={isLoggedIn}>
          <PostLogin />
        </When>
        <Otherwise>
          <PreLogin />
        </Otherwise>
      </Choose> */}
      {isLoggedIn && <PostLogin />}
      {!isLoggedIn && <PreLogin />}
    </Suspense>
  );
};

export default App;
