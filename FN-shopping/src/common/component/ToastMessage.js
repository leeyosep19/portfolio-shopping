  //https://www.npmjs.com/package/react-toastify 참조   메세지 라이브러리

// import React from "react";
// import { useEffect } from "react";
// import { useSelector } from "react-redux";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const ToastMessage = () => {
//   const { toastMessage } = useSelector((state) => state.ui);
//   console.log("here", toastMessage);
//   useEffect(() => {
//     if (toastMessage) {
//       const { message, status } = toastMessage;
//       if (message !== "" && status !== "") {
//         toast[status](message, { theme: "colored" });
//       }
//     }
//   }, [toastMessage]);
//   return (
//     <ToastContainer
//       position="top-right"
//       autoClose={1000}
//       hideProgressBar={false}
//       newestOnTop={false}
//       closeOnClick
//       rtl={false}
//       pauseOnFocusLoss
//       draggable
//       pauseOnHover
//       theme="light"
//     />
//   );
// };

// export default ToastMessage;



import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastMessage = () => {
  const { toastMessage } = useSelector((state) => state.ui);
  
  useEffect(() => {
    if (toastMessage) {
      const { message, status } = toastMessage;
      console.log("Toast message status:", status); // Log status to ensure validity
      if (message !== "" && status !== "" && toast[status]) {
        toast[status](message, { theme: "colored" });
      } else {
        toast.info(message, { theme: "colored" }); // Default to 'info' if status is invalid
      }
    }
  }, [toastMessage]);

  return (
    <ToastContainer
      position="top-right"
      autoClose={1000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  );
};

export default ToastMessage;
