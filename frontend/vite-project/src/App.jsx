import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import { TestForm } from './test'


function App() {
  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route path="/" element={<TestForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App
