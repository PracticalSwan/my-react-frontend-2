import { Route, Routes } from 'react-router-dom'; 
import TestApi from './components/TestApi'; 
import RequireAuth from './middleware/RequireAuth'; 
import Profile from './components/Profile'; 
import Login from './components/Login'; 
import Logout from './components/Logout'; 
import UserManagement from './components/UserManagement';
 
function App() { 
 
  return( 
    <Routes> 
      <Route path='/test_api' element={<TestApi/>}/> 
      <Route path='/login' element={<Login/>}/> 
      <Route path='/profile' element={ 
        <RequireAuth> 
          <Profile/> 
        </RequireAuth> 
      }/> 
      <Route path='/logout' element={ 
        <RequireAuth> 
          <Logout/> 
        </RequireAuth> 
      }/> 
      <Route path='/users' element={
        <RequireAuth>
          <UserManagement/>
        </RequireAuth>
      }/>
    </Routes> 
  ); 
} 
 
export default App 