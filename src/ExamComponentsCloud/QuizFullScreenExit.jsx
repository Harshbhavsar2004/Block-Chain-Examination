// // correct the following code like after pressing ESC key don't exit full screen

// import React, { useEffect } from 'react';
// import swal from 'sweetalert';

// function App() {

//   useEffect(() => {
//     function handleKeyDown(event) {
//       if (event.keyCode === 27) {
//         swal('Warning', 'Escape key pressed', 'warning');
//       }
//     }

//     document.addEventListener("keydown", handleKeyDown);

//     return () => {
//       document.removeEventListener("keydown", handleKeyDown);
//     };
//   }, []);

//   // return (
//   //   <div>
//   //     {/* <h1>My App</h1>
//   //     <p>Press the Escape key to show the pop-up alert</p> */}
//   //   </div>
//   // );
// }

// export default App;

// *************************************************************************************************

// import React, { useEffect } from 'react';
// import swal from 'sweetalert';

// function App() {

//   useEffect(() => {
//     function handleKeyDown(event) {
//       if (event.keyCode === 27) {
//         event.preventDefault();
//         swal('Warning', 'Escape key pressed', 'warning');
//       }
//     }

//     document.addEventListener("keydown", handleKeyDown);

//     return () => {
//       document.removeEventListener("keydown", handleKeyDown);
//     };
//   }, []);

//   return (
//     <div>
//       <h1>My App</h1>
//       <p>Press the Escape key to show the pop-up alert</p>
//     </div>
//   );
// }

// export default App;


// *********************************************************************************************

// import React, { useEffect } from "react";

// function App() {
//   useEffect(() => {
//     document.addEventListener("keydown", handleKeyDown, false);

//     return () => {
//       document.removeEventListener("keydown", handleKeyDown, false);
//     };
//   }, []);

//   const handleKeyDown = (event) => {
//     if (event.key === "Escape") {
//       event.preventDefault();
//     }
//   };

//   // return <div>My App</div>;
// }

// export default App;


// ************************************** New Logout + Esc key code *******************************************************
// the below code first exit fullscreen mode after pressing ESC key and then show warning but i want to direct show logout warning without exit fullscreen so modify the below code as per requirements:

import React, { useEffect, useContext } from 'react';
import swal from 'sweetalert';
import { LoginContext } from '../components/ContextProvider/Context';
import { useNavigate } from 'react-router-dom';

function App() {
  const { logindata, setLoginData } = useContext(LoginContext);
  const history = useNavigate();

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.keyCode === 27) {
        swal({
          title: 'Logout?',
          text: 'Do you really want to log out?',
          icon: 'warning',
          buttons: ['Cancel', 'Logout'],
        }).then((willLogout) => {
          if (willLogout) {
            logoutuser();
          }
        });
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const logoutuser = async () => {
    let token = localStorage.getItem('usersdatatoken');

    const res = await fetch('https://backendofmam.onrender.com/logout', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
        Accept: 'application/json',
      },
      credentials: 'include',
    });

    const data = await res.json();
    console.log(data);

    if (data.status === 201) {
      console.log('User Logout');
      localStorage.removeItem('usersdatatoken');
      setLoginData(false);
      history('/');
    } else {
      console.log('Error');
    }
  };

  return (
    <div>
      {/* Your app code here */}
    </div>
  );
}

export default App;
