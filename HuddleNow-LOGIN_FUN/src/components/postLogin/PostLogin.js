import React from "react";
import { Routes, Route } from "react-router-dom";
import { HOME_PATH } from "routes/routes";
import ProtectedRoute from "routes/ProtectedRoute";

import HomeContainer from "components/home/HomeContainer";
import { MainContainer } from "./PostLogin.styles";

// const PostLogin = () => {
//   return (
//     <>
//       {/* <Header /> */}
//       {/*
//       <Routes>
//         <Route
//           path={HOME_PATH}
//           element={
//             <ProtectedRoute>
//               <HomeContainer />
//             </ProtectedRoute>
//           }
//         />
//       </Routes>
//         */}
//       {/* <Footer /> */}
//       <MainContainer>
//         <div className="flex flex-col basis-1/4 h-screen bg-gradient-to-b from-blue-500 to-purple-500">
//           <div className="flex-none h-14">Tilte</div>
//           <div className="grow">Nav</div>
//           <div className="flex-none h-14 py-4">Bottom</div>
//         </div>

//         {/* <Header /> */}
//         <Routes>
//           <Route
//             path="*"
//             element={
//               <ProtectedRoute>
//                 <div className="flex w-full bg-white-400 flex-col">
//                   <div className="flex-none bg-gray-100">Header</div>
//                   <div className="flex h-screen flex-row">
//                     <div className="grow bg-white-400 p-2"> Main Content</div>
//                     <div className="flex-none h-screen bg-gray-100 basis-1/4 p-2">
//                       Org Tree
//                     </div>
//                   </div>
//                 </div>
//               </ProtectedRoute>
//             }
//           />
//         </Routes>
//       </MainContainer>
//     </>
//   );
// };

const PostLogin = () => {
  return (
    <>
      {/* <Header /> */}
      <Routes>
        <Route
          path={HOME_PATH}
          element={
            <ProtectedRoute>
              <HomeContainer />
            </ProtectedRoute>
          }
        />
      </Routes>
      {/* <Footer /> */}
      
    </>
  );
};

export default PostLogin;
