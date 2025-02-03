import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Navigation from './components/Navigation';
import StudentList from './components/StudentList';
import { StudentForm } from './components/StudentForm';
import { StudentMarks } from './components/StudentMarks'; 
import { StudentDetails } from './components/StudentDetails';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <BrowserRouter>
      <Navigation />
      <Container className="py-4">
        <Routes>
          <Route path="/" element={<StudentList />} />
          <Route path="/students/new" element={<StudentForm />} />
          <Route path="/students/edit/:id" element={<StudentForm isEdit={true} />} />
          <Route path="/students/:id" element={<StudentDetails />} />
          <Route path="/students/:id/marks" element={<StudentMarks />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
};

export default App;