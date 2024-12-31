import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import "./common/style/common.style.css";
import AppLayout from "./Layout/AppLayout";
import AppRouter from "./routes/AppRouter";


//페이지 로고 뜻 다시태어나다 (born again)  shop응 (#) 으로
//~


function App() {
  return (
    <div>
      <AppLayout>
        <AppRouter />
      </AppLayout>
    </div>
  );
}


export default App;



