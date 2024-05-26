import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import { UserProvider } from './UserContext'
import { LoginForm, LogoutForm, SignupForm, ProfileForm } from './account'
import { MainPageForm } from './mainpage'
import { DiaryCalendarForm, DiaryWriteForm, DiaryListForm, DiaryDetailForm } from './diary'


function App() {
  return (
    <UserProvider>
      <Router>
        <div className='App'>
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/logout" element={<LogoutForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/profile" element={<ProfileForm />} />
            <Route path="/calendar" element={<DiaryCalendarForm />} />
            <Route path="/diary/write" element={<DiaryWriteForm />} />
            <Route path="/diary/list" element={<DiaryListForm />} />
            <Route path="/diary/:id" element={<DiaryDetailForm />} />
            <Route path="/" element={<MainPageForm />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App
