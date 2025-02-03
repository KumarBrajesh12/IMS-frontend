import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { studentApi } from '../services/api';
import { StudentMarks } from './StudentMarks';
import { FaEdit, FaArrowLeft } from 'react-icons/fa';
import Swal from 'sweetalert2';

export const StudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentDetails();
  }, [id]);

  const fetchStudentDetails = async () => {
    try {
      if (!id) return;
      const response = await studentApi.getById(parseInt(id));
      setStudent(response.data);
    } catch (error) {
      Swal.fire('Error', 'Failed to fetch student details', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!student) {
    return <div>Student not found</div>;
  }

  return (
    <div className="student-details">
      <Button 
        variant="outline-primary" 
        className="mb-3"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft /> Back
      </Button>

      <Card className="mb-4">
        <Card.Header as="h5">Student Information</Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <p><strong>Name:</strong> {`${student.first_name} ${student.last_name}`}</p>
              <p><strong>Email:</strong> {student.email}</p>
              <p><strong>Date of Birth:</strong> {new Date(student.date_of_birth).toLocaleDateString()}</p>
            </Col>
          </Row>
          <Button 
            variant="primary"
            onClick={() => navigate(`/students/edit/${student.id}`)}
          >
            <FaEdit /> Edit Student
          </Button>
        </Card.Body>
      </Card>

      <StudentMarks studentId={parseInt(id)} />
    </div>
  );
};